import type { GeneratorCallback, Tree } from '@nx/devkit';
import {
  addDependenciesToPackageJson,
  updateNxJson as devkitUpdateNxJson,
  formatFiles,
  joinPathFragments,
  logger,
  readJson,
  readNxJson,
  stripIndents,
  updateJson,
  writeJson,
} from '@nx/devkit';
import type { Config } from 'stylelint';
import { stylelintConfigFilePattern } from '../../utils/config-file';
import {
  stylelintConfigStandardScssVersion,
  stylelintConfigStandardVersion,
  stylelintVSCodeExtension,
  stylelintVersion,
} from '../../utils/versions';
import type { InitGeneratorSchema } from './schema';

/** nx-stylelint:init generator */
export async function initGenerator(tree: Tree, options: InitGeneratorSchema): Promise<GeneratorCallback> {
  const installTask = updateDependencies(tree, !!options.scss);

  if (!tree.exists('.stylelintrc.json')) createRecommendedStylelintConfiguration(tree, !!options.scss);
  else if (options.scss === true && isCompatibleRootConfig(tree)) addScssToStylelintConfiguration(tree);
  else {
    logger.info(
      `Stylelint root configuration found! Skipping creation of root .stylelintrc.json!

Please be aware that your own configuration can lead to problems with nx-stylelint's behavior!
We recommend renaming your custom '.stylelintrc.json' file and running the generator again with 'nx g nx-stylelint:init'.
You can then migrate your custom rule configuration into the created stylelint configuration.`
    );
  }

  updateNxJson(tree);
  updateVSCodeExtensions(tree);

  if (options.skipFormat !== true) await formatFiles(tree);
  return installTask;
}

export default initGenerator;

/** Adds Stylelint and shared configs to the devDependencies of the package.json if not present */
function updateDependencies(tree: Tree, scss: boolean): GeneratorCallback {
  const packageJson = readJson(tree, 'package.json');
  const devDependencies: { [index: string]: string } = {};

  if (!packageJson.dependencies?.stylelint) devDependencies['stylelint'] = stylelintVersion;

  if (!packageJson.dependencies?.['stylelint-config-standard'])
    devDependencies['stylelint-config-standard'] = stylelintConfigStandardVersion;
  if (scss && !packageJson.dependencies?.['stylelint-config-standard-scss'])
    devDependencies['stylelint-config-standard-scss'] = stylelintConfigStandardScssVersion;

  return addDependenciesToPackageJson(tree, {}, devDependencies);
}

/** Adds the Stylelint VSCode Extension to the recommenden Extensions if the file exists */
function updateVSCodeExtensions(tree: Tree): void {
  if (!tree.exists('.vscode/extensions.json')) return;

  updateJson(tree, '.vscode/extensions.json', (json) => {
    json.recommendations ??= [];

    if (Array.isArray(json.recommendations) && !json.recommendations.includes(stylelintVSCodeExtension))
      json.recommendations.push(stylelintVSCodeExtension);

    return json;
  });
}

/** Adds the root .stylelintrc.json file to the targetDefaults and stylelint target to the cacheable operations of the default task runner */
function updateNxJson(tree: Tree) {
  const nxJson = readNxJson(tree);
  if (!nxJson) {
    logger.warn(
      stripIndents`nx.json not found. Create a nx.json file and rerun the generator with 'nx run nx-stylelint:init' to configure nx-stylelint inputs and taskrunner options.`
    );
    return;
  }

  // remove stylelint config files from production inputs
  const stylelintProjectConfigFilePattern = `!${joinPathFragments('{projectRoot}', stylelintConfigFilePattern)}`;
  if (
    nxJson.namedInputs?.['production'] &&
    !nxJson.namedInputs?.['production'].includes(stylelintProjectConfigFilePattern)
  ) {
    nxJson.namedInputs?.['production'].push(stylelintProjectConfigFilePattern);
  }

  // Set targetDefault for stylelint
  nxJson.targetDefaults ??= {};
  nxJson.targetDefaults['stylelint'] ??= {};
  nxJson.targetDefaults['stylelint'].inputs ??= ['default'];
  nxJson.targetDefaults['stylelint'].cache = true;

  const rootStylelintConfigurationFile = joinPathFragments('{workspaceRoot}', stylelintConfigFilePattern);
  if (!nxJson.targetDefaults['stylelint'].inputs.includes(rootStylelintConfigurationFile))
    nxJson.targetDefaults['stylelint'].inputs.push(rootStylelintConfigurationFile);

  devkitUpdateNxJson(tree, nxJson);
}

function createRecommendedStylelintConfiguration(tree: Tree, scss: boolean) {
  const config = {
    ignoreFiles: ['**/*'],
    overrides: [
      {
        files: ['**/*.css'],
        extends: ['stylelint-config-standard'],
        rules: {},
      },
    ],
    rules: {},
  };

  if (scss)
    config.overrides.push({
      files: ['**/*.scss'],
      extends: ['stylelint-config-standard-scss'],
      rules: {},
    });

  writeJson<Config>(tree, '.stylelintrc.json', config);
}

function isCompatibleRootConfig(tree: Tree): boolean {
  const config = readJson<Config>(tree, '.stylelintrc.json');
  return config.ignoreFiles === '**/*' || (Array.isArray(config.ignoreFiles) && config.ignoreFiles.includes('**/*'));
}

function addScssToStylelintConfiguration(tree: Tree) {
  updateJson<Config, Config>(tree, '.stylelintrc.json', (value) => {
    if (
      value.overrides?.find(
        (item) =>
          (item.files === '**/*.scss' || (Array.isArray(item.files) && item.files.includes('**/*.scss'))) &&
          (item.extends === 'stylelint-config-standard-scss' ||
            (Array.isArray(item.extends) && item.extends.includes('stylelint-config-standard-scss')))
      )
    )
      return value;

    return {
      ...value,
      overrides: Array.from(
        new Set([
          ...(value.overrides ?? []),
          {
            files: ['**/*.scss'],
            extends: ['stylelint-config-standard-scss'],
            rules: {},
          },
        ])
      ),
    };
  });
}
