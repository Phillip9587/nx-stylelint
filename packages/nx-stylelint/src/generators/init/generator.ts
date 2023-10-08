import {
  updateJson,
  addDependenciesToPackageJson,
  writeJson,
  formatFiles,
  logger,
  readJson,
  stripIndents,
  joinPathFragments,
  readNxJson,
  updateNxJson,
} from '@nx/devkit';
import type { Tree, GeneratorCallback } from '@nx/devkit';
import {
  stylelintConfigStandardScssVersion,
  stylelintConfigStandardVersion,
  stylelintVersion,
  stylelintVSCodeExtension,
} from '../../utils/versions';
import type { InitGeneratorSchema } from './schema';
import type { Config } from 'stylelint';
import { stylelintConfigFilePattern } from '../../utils/config-file';

/** nx-stylelint:init generator */
export async function initGenerator(host: Tree, options: InitGeneratorSchema): Promise<GeneratorCallback> {
  const installTask = updateDependencies(host, !!options.scss);

  if (!host.exists('.stylelintrc.json')) createRecommendedStylelintConfiguration(host, !!options.scss);
  else if (isCompatibleRootConfig(host)) addScssToStylelintConfiguration(host);
  else {
    logger.info(
      `Stylelint root configuration found! Skipping creation of root .stylelintrc.json!

Please be aware that your own configuration can lead to problems with nx-stylelint's behavior!
We recommend renaming your custom '.stylelintrc.json' file and running the generator again with 'nx g nx-stylelint:init'.
You can then migrate your custom rule configuration into the created stylelint configuration.`
    );
  }

  addStylelintInputs(host);
  updateVSCodeExtensions(host);

  if (options.skipFormat !== true) await formatFiles(host);
  return installTask;
}

export default initGenerator;

/** Adds Stylelint and shared configs to the devDependencies of the package.json if not present */
function updateDependencies(host: Tree, scss: boolean): GeneratorCallback {
  const packageJson = readJson(host, 'package.json');
  const devDependencies: { [index: string]: string } = {};

  if (!packageJson.dependencies?.stylelint) devDependencies['stylelint'] = stylelintVersion;

  if (!packageJson.dependencies?.['stylelint-config-standard'])
    devDependencies['stylelint-config-standard'] = stylelintConfigStandardVersion;
  if (scss && !packageJson.dependencies?.['stylelint-config-standard-scss'])
    devDependencies['stylelint-config-standard-scss'] = stylelintConfigStandardScssVersion;

  return addDependenciesToPackageJson(host, {}, devDependencies);
}

/** Adds the Stylelint VSCode Extension to the recommenden Extensions if the file exists */
function updateVSCodeExtensions(host: Tree): void {
  if (!host.exists('.vscode/extensions.json')) return;

  updateJson(host, '.vscode/extensions.json', (json) => {
    json.recommendations ??= [];

    if (Array.isArray(json.recommendations) && !json.recommendations.includes(stylelintVSCodeExtension))
      json.recommendations.push(stylelintVSCodeExtension);

    return json;
  });
}

/** Adds the root .stylelintrc.json file to the targetDefaults and stylelint target to the cacheable operations of the default task runner */
function addStylelintInputs(host: Tree) {
  const nxJson = readNxJson(host);
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
  const rootStylelintConfigurationFile = joinPathFragments('{workspaceRoot}', stylelintConfigFilePattern);
  if (!nxJson.targetDefaults['stylelint'].inputs.includes(rootStylelintConfigurationFile))
    nxJson.targetDefaults['stylelint'].inputs.push(rootStylelintConfigurationFile);

  // Add stylelint target to cacheableOperations
  if (nxJson.tasksRunnerOptions?.['default']) {
    const taskRunner = nxJson.tasksRunnerOptions?.['default'];

    taskRunner.options ??= {};
    taskRunner.options.cacheableOperations ??= [];

    if (!taskRunner.options.cacheableOperations.includes('stylelint'))
      taskRunner.options.cacheableOperations.push('stylelint');

    nxJson.tasksRunnerOptions['default'] = taskRunner;
  } else {
    logger.warn(
      stripIndents`Default Task Runner not found. Please add 'stylelint' to the Cacheable Operations of your task runner!
        See: https://nx.dev/latest/node/core-concepts/configuration#tasks-runner-options`
    );
  }

  updateNxJson(host, nxJson);
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
  updateJson<Config, Config>(tree, '.stylelintrc.json', (value) => ({
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
  }));
}
