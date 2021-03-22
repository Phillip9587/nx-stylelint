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
  readJson,
} from '@nrwl/devkit';
import {
  rootStylelintConfiguration,
  stylelintConfigFile,
  stylelintConfigPrettierVersion,
  stylelintConfigStandardVersion,
  stylelintVersion,
  stylelintVSCodeExtension,
  VSCodeExtensionsFilePath,
} from '../../defaults';
import { InitGeneratorSchema } from './schema';

/** nx-stylelint:init generator */
export default async function (host: Tree, options: InitGeneratorSchema): Promise<GeneratorCallback> {
  const installTask = checkDependenciesInstalled(host);

  if (!host.exists(stylelintConfigFile)) createStylelintConfig(host);
  else logger.info(`Stylelint root configuration found! Skipping creation of ${stylelintConfigFile}!`);

  addStylelintToWorkspaceConfiguration(host);
  updateExtensions(host);

  if (!options.skipFormat) await formatFiles(host);
  return installTask;
}

function checkDependenciesInstalled(host: Tree) {
  const packageJson = readJson(host, 'package.json');
  const devDependencies: { [index: string]: string } = {};

  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencices = packageJson.devDependencices || {};

  if (!packageJson.dependencies['stylelint'] && !packageJson.devDependencies['stylelint'])
    devDependencies['stylelint'] = stylelintVersion;

  if (
    !packageJson.dependencies['stylelint-config-prettier'] &&
    !packageJson.devDependencies['stylelint-config-prettier']
  )
    devDependencies['stylelint-config-prettier'] = stylelintConfigPrettierVersion;

  if (
    !packageJson.dependencies['stylelint-config-standard'] &&
    !packageJson.devDependencies['stylelint-config-standard']
  )
    devDependencies['stylelint-config-standard'] = stylelintConfigStandardVersion;

  return addDependenciesToPackageJson(host, {}, devDependencies);
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
