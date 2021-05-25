import {
  formatFiles,
  joinPathFragments,
  normalizePath,
  offsetFromRoot,
  readProjectConfiguration,
  updateProjectConfiguration,
  writeJson,
  logger,
} from '@nrwl/devkit';
import type { Tree } from '@nrwl/devkit';
import type { Configuration as StylelintConfiguration } from 'stylelint';
import type { ConfigurationGeneratorSchema } from './schema';
import init from '../init/generator';
import type { LintExecutorSchema } from '../../executors/lint/schema';
import { defaultTargetConfiguration, stylelintConfigFile } from '../../defaults';

interface NormalizedSchema extends ConfigurationGeneratorSchema {
  projectRoot: string;
  stylelintTargetExists: boolean;
}

/** nx-stylelint:configuration generator */
export default async function (host: Tree, options: ConfigurationGeneratorSchema): Promise<void> {
  await init(host, { skipFormat: options.skipFormat });

  const normalizedOptions = normalizeSchema(host, options);

  if (normalizedOptions.stylelintTargetExists)
    throw new Error(`Project '${options.project}' already has a stylelint target.`);

  logger.info(`Adding Stylelint configuration and target to '${options.project}' ...\n`);

  createStylelintConfig(host, normalizedOptions);
  addStylelintTarget(host, normalizedOptions);

  if (options.skipFormat == false) await formatFiles(host);
}

function normalizeSchema(tree: Tree, options: ConfigurationGeneratorSchema): NormalizedSchema {
  const projectConfig = readProjectConfiguration(tree, options.project);

  return {
    ...options,
    projectRoot: projectConfig.root,
    stylelintTargetExists: projectConfig.targets.stylelint != null,
  };
}

function addStylelintTarget(host: Tree, options: NormalizedSchema) {
  const projectConfig = readProjectConfiguration(host, options.project);

  const targetOptions: Partial<LintExecutorSchema> = {
    config: joinPathFragments(normalizePath(options.projectRoot), stylelintConfigFile),
    lintFilePatterns: [joinPathFragments(normalizePath(options.projectRoot), '**', '*.{css,scss,sass,less}')],
  };

  if (options.format !== 'string') targetOptions.format = options.format;

  projectConfig.targets.stylelint = { ...defaultTargetConfiguration, options: targetOptions };
  updateProjectConfiguration(host, options.project, projectConfig);
}

function createStylelintConfig(host: Tree, options: NormalizedSchema) {
  const config: Partial<StylelintConfiguration> = {
    extends: [joinPathFragments(offsetFromRoot(options.projectRoot), stylelintConfigFile)],
  };

  writeJson(host, joinPathFragments(normalizePath(options.projectRoot), stylelintConfigFile), config);
}
