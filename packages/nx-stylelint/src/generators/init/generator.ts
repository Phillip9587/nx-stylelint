import {
  updateJson,
  addDependenciesToPackageJson,
  writeJson,
  formatFiles,
  logger,
  readJson,
  stripIndents,
  updateWorkspaceConfiguration,
  readWorkspaceConfiguration,
  joinPathFragments,
} from '@nrwl/devkit';
import type { Tree, GeneratorCallback, WorkspaceConfiguration } from '@nrwl/devkit';
import { stylelintConfigStandardVersion, stylelintVersion, stylelintVSCodeExtension } from '../../utils/versions';
import type { InitGeneratorSchema } from './schema';
import type { Config } from 'stylelint';
import { stylelintConfigFilePattern } from '../../utils/config-file';

/** nx-stylelint:init generator */
export async function initGenerator(host: Tree, options: InitGeneratorSchema): Promise<GeneratorCallback> {
  const rootConfigExists = host.exists('.stylelintrc.json');
  const installTask = updateDependencies(host, rootConfigExists);

  if (!rootConfigExists) createRecommendedStylelintConfiguration(host);
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
function updateDependencies(host: Tree, rootConfigExists: boolean): GeneratorCallback {
  const packageJson = readJson(host, 'package.json');
  const devDependencies: { [index: string]: string } = {};

  if (!packageJson.dependencies.stylelint) devDependencies['stylelint'] = stylelintVersion;

  if (!rootConfigExists) {
    if (!packageJson.dependencies['stylelint-config-standard'])
      devDependencies['stylelint-config-standard'] = stylelintConfigStandardVersion;
  }

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
  const workspaceConfiguration: WorkspaceConfiguration = readWorkspaceConfiguration(host);

  // remove stylelint config files from production inputs
  const stylelintProjectConfigFilePattern = `!${joinPathFragments('{projectRoot}', stylelintConfigFilePattern)}`;
  if (
    workspaceConfiguration.namedInputs?.['production'] &&
    !workspaceConfiguration.namedInputs?.['production'].includes(stylelintProjectConfigFilePattern)
  ) {
    workspaceConfiguration.namedInputs?.['production'].push(stylelintProjectConfigFilePattern);
  }

  // Set targetDefault for stylelint
  workspaceConfiguration.targetDefaults ??= {};
  workspaceConfiguration.targetDefaults['stylelint'] ??= {};
  workspaceConfiguration.targetDefaults['stylelint'].inputs ??= ['default'];
  const rootStylelintConfigurationFile = joinPathFragments('{workspaceRoot}', stylelintConfigFilePattern);
  if (!workspaceConfiguration.targetDefaults['stylelint'].inputs.includes(rootStylelintConfigurationFile))
    workspaceConfiguration.targetDefaults['stylelint'].inputs.push(rootStylelintConfigurationFile);

  // Add stylelint target to cacheableOperations
  if (workspaceConfiguration.tasksRunnerOptions?.['default']) {
    const taskRunner = workspaceConfiguration.tasksRunnerOptions?.['default'];

    taskRunner.options ??= {};
    taskRunner.options.cacheableOperations ??= [];

    if (!taskRunner.options.cacheableOperations.includes('stylelint'))
      taskRunner.options.cacheableOperations.push('stylelint');

    workspaceConfiguration.tasksRunnerOptions['default'] = taskRunner;
  } else {
    logger.warn(
      stripIndents`Default Task Runner not found. Please add 'stylelint' to the Cacheable Operations of your task runner!
        See: https://nx.dev/latest/node/core-concepts/configuration#tasks-runner-options`
    );
  }

  updateWorkspaceConfiguration(host, workspaceConfiguration);
}

function createRecommendedStylelintConfiguration(host: Tree) {
  writeJson<Config>(host, '.stylelintrc.json', {
    ignoreFiles: ['**/*'],
    overrides: [
      {
        files: ['**/*.css'],
        extends: ['stylelint-config-standard'],
        rules: {},
      },
    ],
    rules: {},
  });
}
