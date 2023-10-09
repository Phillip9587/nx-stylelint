import {
  formatFiles,
  joinPathFragments,
  logger,
  readProjectConfiguration,
  updateJson,
  updateProjectConfiguration,
} from '@nx/devkit';
import type { ProjectConfiguration, Tree } from '@nx/devkit';
import type { Config } from 'stylelint';
import type { ScssGeneratorSchema } from './schema';
import type { LintExecutorSchema } from '../../executors/lint/schema';
import { initGenerator } from '../init/generator';

interface NormalizedSchema extends ScssGeneratorSchema {
  projectConfig: ProjectConfiguration;
  hasStylelintTarget: boolean;
}
/** nx-stylelint:scss generator
 * @deprecated Will be removed in v17. Use the nx-stylelint:configuration generator with the scss option
 */
export async function scssGenerator(tree: Tree, options: ScssGeneratorSchema) {
  const init = await initGenerator(tree, { skipFormat: options.skipFormat, scss: true });

  const normalizedOptions = normalizeSchema(tree, options);

  if (!normalizedOptions.hasStylelintTarget) {
    logger.error(
      `Project ${options.project} has no stylelint target. Please run the 'nx-stylelint:configuration' generator to create a target and stylelint configuration.`
    );
    return;
  }

  ensureRootScssConfiguration(tree);

  updateProjectConfig(tree, normalizedOptions);

  if (options.skipFormat !== true) await formatFiles(tree);
  return init;
}

export default scssGenerator;

function normalizeSchema(tree: Tree, options: ScssGeneratorSchema): NormalizedSchema {
  const projectConfig = readProjectConfiguration(tree, options.project);

  return {
    ...options,
    projectConfig,
    hasStylelintTarget: projectConfig.targets?.['stylelint'] !== undefined,
  };
}

function ensureRootScssConfiguration(tree: Tree) {
  updateJson<Config, Config>(tree, '.stylelintrc.json', (config) => {
    config.overrides ??= [];

    if (
      !config.overrides.some((v) => {
        if (typeof v.files === 'string') {
          if (v.files.includes('*.scss')) return true;
        } else if (v.files.some((v) => v.includes('*.scss'))) return true;
        return false;
      })
    ) {
      config.overrides.push({
        files: ['**/*.scss'],
        extends: ['stylelint-config-standard-scss'],
        rules: {},
      });
    }

    return config;
  });
}

function updateProjectConfig(tree: Tree, options: NormalizedSchema) {
  const projectConfig = options.projectConfig;
  const stylelintTarget = projectConfig.targets?.['stylelint'];

  if (!stylelintTarget) return;

  const targetOptions = stylelintTarget.options as LintExecutorSchema;

  targetOptions.lintFilePatterns ??= [];
  targetOptions.lintFilePatterns.push(joinPathFragments(options.projectConfig.root, '**', '*.scss'));

  updateProjectConfiguration(tree, options.project, projectConfig);

  const configFilePath = targetOptions.configFile ?? joinPathFragments(projectConfig.root, '.stylelintrc.json');

  updateJson<Config, Config>(tree, configFilePath, (config) => {
    config.overrides ??= [];

    if (
      !config.overrides.some((v) => {
        if (typeof v.files === 'string') {
          if (v.files.includes('**/*.scss')) return true;
        } else if (v.files.some((v) => v.includes('**/*.scss'))) return true;
        return false;
      })
    ) {
      config.overrides.push({
        files: ['**/*.scss'],
        rules: {},
      });
    }

    return config;
  });
}