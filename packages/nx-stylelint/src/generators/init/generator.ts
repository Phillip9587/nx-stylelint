import {
  Tree,
  updateJson,
  addDependenciesToPackageJson,
  writeJson,
  GeneratorCallback,
  formatFiles,
  logger,
  readWorkspaceConfiguration,
  updateWorkspaceConfiguration,
  WorkspaceConfiguration,
} from '@nrwl/devkit';
import {
  rootStylelintConfiguration,
  stylelintConfigFile,
  stylelintConfigIdiomaticOrderVersion,
  stylelintConfigPrettierVersion,
  stylelintConfigStandardVersion,
  stylelintVersion,
  stylelintVSCodeExtension,
  VSCodeExtensionsFilePath,
} from '../../defaults';
import { InitGeneratorSchema } from './schema';

/** nx-stylelint:init generator */
export default async function (host: Tree, options: InitGeneratorSchema): Promise<GeneratorCallback> {
  if (host.exists(stylelintConfigFile)) {
    logger.info('Stylelint root configuration found! Skipping init!\n');
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }

  removeStylelintFromDeps(host);
  const installTask = updateDependencies(host);

  createStylelintConfig(host);
  addStylelintToWorkspaceConfiguration(host);
  updateExtensions(host);

  if (!options.skipFormat) await formatFiles(host);
  return installTask;
}

function updateDependencies(host: Tree): GeneratorCallback {
  const devDeps = {
    stylelint: stylelintVersion,
    'stylelint-config-prettier': stylelintConfigPrettierVersion,
    'stylelint-config-standard': stylelintConfigStandardVersion,
    'stylelint-config-idiomatic-order': stylelintConfigIdiomaticOrderVersion,
  };

  return addDependenciesToPackageJson(host, {}, devDeps);
}

function removeStylelintFromDeps(host: Tree) {
  updateJson(host, 'package.json', (json) => {
    if (json.dependencies && json.dependencies['stylelint']) {
      delete json.dependencies['stylelint'];
    }
    return json;
  });
}

function updateExtensions(host: Tree) {
  if (!host.exists(VSCodeExtensionsFilePath)) return;

  updateJson(host, VSCodeExtensionsFilePath, (json) => {
    json.recommendations = json.recommendations || [];

    if (Array.isArray(json.recommendations) && !json.recommendations.includes(stylelintVSCodeExtension))
      json.recommendations.push(stylelintVSCodeExtension);

    return json;
  });
}

function addStylelintToWorkspaceConfiguration(host: Tree) {
  const workspace: WorkspaceConfiguration = readWorkspaceConfiguration(host);

  // Add root .stylelintrc.json to implicit dependencies
  workspace.implicitDependencies = workspace.implicitDependencies || {};
  workspace.implicitDependencies[stylelintConfigFile] = '*';

  // Add stylelint target to cacheableOperations
  if (workspace.tasksRunnerOptions && workspace.tasksRunnerOptions.default) {
    workspace.tasksRunnerOptions.default.options = workspace.tasksRunnerOptions.default.options || {};

    workspace.tasksRunnerOptions.default.options.cacheableOperations =
      workspace.tasksRunnerOptions.default.options.cacheableOperations || [];
    if (!workspace.tasksRunnerOptions.default.options.cacheableOperations.includes('stylelint')) {
      workspace.tasksRunnerOptions.default.options.cacheableOperations.push('stylelint');
    }
  } else {
    logger.warn(
      "Default Task Runner not found. Please add 'stylelint' target to cacheableOperations of your task runner!"
    );
  }

  updateWorkspaceConfiguration(host, workspace);
}

function createStylelintConfig(host: Tree) {
  writeJson(host, stylelintConfigFile, rootStylelintConfiguration);
}
