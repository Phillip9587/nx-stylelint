import {
  updateJson,
  addDependenciesToPackageJson,
  writeJson,
  formatFiles,
  logger,
  readJson,
  stripIndents,
  convertNxGenerator,
} from '@nrwl/devkit';
import type { Tree, NxJsonConfiguration, GeneratorCallback } from '@nrwl/devkit';
import {
  recommendedRootStylelintConfiguration,
  stylelintConfigFile,
  stylelintConfigIdiomaticOrderVersion,
  stylelintConfigPrettierVersion,
  stylelintConfigStandardVersion,
  stylelintVersion,
  stylelintVSCodeExtension,
  VSCodeExtensionsFilePath,
} from '../../defaults';
import type { InitGeneratorSchema } from './schema';

/** nx-stylelint:init generator */
export async function initGenerator(host: Tree, options: InitGeneratorSchema): Promise<GeneratorCallback> {
  const rootConfigExists = host.exists(stylelintConfigFile);
  const installTask = updateDependencies(host, rootConfigExists);

  if (!rootConfigExists) createRecommendedStylelintConfiguration(host);
  else logger.info(`Stylelint root configuration found! Skipping creation of root ${stylelintConfigFile}!`);

  updateNxJson(host);
  updateExtensions(host);

  if (options.skipFormat !== true) await formatFiles(host);
  return installTask;
}

export default initGenerator;
export const initSchematic = convertNxGenerator(initGenerator);

function updateDependencies(host: Tree, rootConfigExists: boolean) {
  const packageJson = readJson(host, 'package.json');
  const devDependencies: { [index: string]: string } = {};

  packageJson.dependencies ??= {};

  if (!packageJson.dependencies.stylelint) devDependencies.stylelint = stylelintVersion;

  // If the root configuration does not exists install packages for a recommended stylelint configuration
  if (!rootConfigExists) {
    if (!packageJson.dependencies['stylelint-config-idiomatic-order'])
      devDependencies['stylelint-config-idiomatic-order'] = stylelintConfigIdiomaticOrderVersion;

    if (!packageJson.dependencies['stylelint-config-prettier'])
      devDependencies['stylelint-config-prettier'] = stylelintConfigPrettierVersion;

    if (!packageJson.dependencies['stylelint-config-standard'])
      devDependencies['stylelint-config-standard'] = stylelintConfigStandardVersion;
  }

  return addDependenciesToPackageJson(host, {}, devDependencies);
}

function updateExtensions(host: Tree) {
  if (!host.exists(VSCodeExtensionsFilePath)) return;

  updateJson(host, VSCodeExtensionsFilePath, (json) => {
    json.recommendations ??= [];

    if (Array.isArray(json.recommendations) && !json.recommendations.includes(stylelintVSCodeExtension))
      json.recommendations.push(stylelintVSCodeExtension);

    return json;
  });
}

function updateNxJson(host: Tree) {
  updateJson<NxJsonConfiguration>(host, 'nx.json', (nxJson) => {
    // Add root .stylelintrc.json to implicit dependencies
    nxJson.implicitDependencies ??= {};
    nxJson.implicitDependencies[stylelintConfigFile] = '*';

    // Add stylelint target to cacheableOperations
    if (nxJson.tasksRunnerOptions?.default) {
      const taskRunner = nxJson.tasksRunnerOptions?.default;

      taskRunner.options ??= {};
      taskRunner.options.cacheableOperations ??= [];

      if (!taskRunner.options.cacheableOperations.includes('stylelint'))
        taskRunner.options.cacheableOperations.push('stylelint');

      nxJson.tasksRunnerOptions.default = taskRunner;
    } else {
      logger.warn(
        stripIndents`Default Task Runner not found. Please add 'stylelint' to the Cacheable Operations of your task runner!
          See: https://nx.dev/latest/node/core-concepts/configuration#tasks-runner-options`
      );
    }

    return nxJson;
  });
}

function createRecommendedStylelintConfiguration(host: Tree) {
  writeJson(host, stylelintConfigFile, recommendedRootStylelintConfiguration);
}
