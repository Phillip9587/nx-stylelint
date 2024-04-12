import type { GeneratorCallback, Tree } from '@nx/devkit';
import {
  addDependenciesToPackageJson,
  updateNxJson,
  formatFiles,
  joinPathFragments,
  logger,
  readJson,
  readNxJson,
  updateJson,
} from '@nx/devkit';
import type { Config } from 'stylelint';
import { ROOT_STYLELINT_CONFIG_SCSS_OVERRIDE } from '../../utils/config';
import {
  STYLELINT_CONFIG_FILE,
  STYLELINT_CONFIG_FILE_PATTERN,
  createRootStylelintConfigFile,
  isCompatibleRootConfig,
} from '../../utils/config-file';
import {
  stylelintConfigStandardScssVersion,
  stylelintConfigStandardVersion,
  stylelintVersion,
} from '../../utils/versions';
import { addStylelintVSCodeExtension } from '../../utils/vscode';
import type { InitGeneratorSchema } from './schema';

const NX_JSON_WARNING = `nx.json not found. Create a nx.json file and rerun the generator with 'nx g nx-stylelint:init'.`;

/** nx-stylelint:init generator */
export async function initGenerator(tree: Tree, options: InitGeneratorSchema): Promise<GeneratorCallback> {
  const installTask = updateDependencies(tree, !!options.scss);

  if (!tree.exists('.stylelintrc.json')) createRootStylelintConfigFile(tree, !!options.scss);
  else if (options.scss === true && isCompatibleRootConfig(tree)) addScssToStylelintConfiguration(tree);
  else {
    logger.info(
      `Stylelint root configuration found! Skipping creation of root .stylelintrc.json!

Please be aware that your own configuration can lead to problems with nx-stylelint's behavior!
We recommend renaming your custom '.stylelintrc.json' file and running the generator again with 'nx g nx-stylelint:init'.
You can then migrate your custom rule configuration into the created stylelint configuration.`,
    );
  }

  addTargetDefaults(tree);
  updateProductionFileset(tree);

  addStylelintVSCodeExtension(tree);

  if (options.skipFormat !== true) await formatFiles(tree);
  return installTask;
}

export default initGenerator;

/** Adds Stylelint and shared configs to the devDependencies of the package.json if not present */
function updateDependencies(tree: Tree, scss: boolean): GeneratorCallback {
  const packageJson = readJson(tree, 'package.json');
  const devDependencies: Record<string, string> = {};

  if (!packageJson.dependencies?.stylelint) devDependencies['stylelint'] = stylelintVersion;

  if (!packageJson.dependencies?.['stylelint-config-standard'])
    devDependencies['stylelint-config-standard'] = stylelintConfigStandardVersion;
  if (scss && !packageJson.dependencies?.['stylelint-config-standard-scss'])
    devDependencies['stylelint-config-standard-scss'] = stylelintConfigStandardScssVersion;

  return addDependenciesToPackageJson(tree, {}, devDependencies);
}

function addTargetDefaults(tree: Tree): void {
  const nxJson = readNxJson(tree);
  if (!nxJson) {
    logger.warn(NX_JSON_WARNING);
    return;
  }

  nxJson.targetDefaults ??= {};
  nxJson.targetDefaults['stylelint'] ??= {};
  nxJson.targetDefaults['stylelint'].inputs ??= ['default'];
  nxJson.targetDefaults['stylelint'].cache = true;

  const rootStylelintConfigurationFile = joinPathFragments('{workspaceRoot}', STYLELINT_CONFIG_FILE_PATTERN);
  if (!nxJson.targetDefaults['stylelint'].inputs.includes(rootStylelintConfigurationFile))
    nxJson.targetDefaults['stylelint'].inputs.push(rootStylelintConfigurationFile);

  updateNxJson(tree, nxJson);
}

function updateProductionFileset(tree: Tree) {
  const nxJson = readNxJson(tree);
  if (!nxJson) {
    logger.warn(NX_JSON_WARNING);
    return;
  }

  const negatedStylelintProjectConfigFilePattern = `!${joinPathFragments('{projectRoot}', STYLELINT_CONFIG_FILE_PATTERN)}`;
  if (
    nxJson.namedInputs?.['production'] &&
    !nxJson.namedInputs?.['production'].includes(negatedStylelintProjectConfigFilePattern)
  )
    nxJson.namedInputs?.['production'].push(negatedStylelintProjectConfigFilePattern);

  updateNxJson(tree, nxJson);
}

function addScssToStylelintConfiguration(tree: Tree) {
  updateJson<Config, Config>(tree, STYLELINT_CONFIG_FILE, (value) => {
    if (
      value.overrides?.find(
        (item) =>
          (item.files === '**/*.scss' || (Array.isArray(item.files) && item.files.includes('**/*.scss'))) &&
          (item.extends === 'stylelint-config-standard-scss' ||
            (Array.isArray(item.extends) && item.extends.includes('stylelint-config-standard-scss'))),
      )
    )
      return value;

    return {
      ...value,
      overrides: Array.from(new Set([...(value.overrides ?? []), ROOT_STYLELINT_CONFIG_SCSS_OVERRIDE])),
    };
  });
}
