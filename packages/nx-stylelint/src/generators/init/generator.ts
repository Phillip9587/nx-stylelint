import {
  Tree,
  updateJson,
  addDependenciesToPackageJson,
  writeJson,
  GeneratorCallback,
  formatFiles,
  logger,
  NxJsonConfiguration,
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
  updateNxConfiguration(host);
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

    if (!json.recommendations.includes(stylelintVSCodeExtension)) json.recommendations.push(stylelintVSCodeExtension);

    return json;
  });
}

function updateNxConfiguration(host: Tree) {
  if (!host.exists('nx.json')) return;

  updateJson(host, 'nx.json', (config: NxJsonConfiguration) => {
    // Add Stylelint config File to implicit dependencies
    config.implicitDependencies = config.implicitDependencies || {};
    config.implicitDependencies[stylelintConfigFile] = '*';

    // Add Stylelint Target to cacheableOperations
    const defaultTaskRunner = config.tasksRunnerOptions?.['default'];
    if (defaultTaskRunner) {
      const cacheableOperations = defaultTaskRunner.options.cacheableOperations || [];
      if (!cacheableOperations.includes('stylelint')) {
        cacheableOperations.push('stylelint');
        defaultTaskRunner.options.cacheableOperations = cacheableOperations;
      }
    } else {
      logger.warn(
        "Default Task Runner not found. Please add 'stylelint' target to cacheable operations of your task runner!"
      );
    }

    return config;
  });
}

function createStylelintConfig(host: Tree) {
  writeJson(host, stylelintConfigFile, rootStylelintConfiguration);
}
