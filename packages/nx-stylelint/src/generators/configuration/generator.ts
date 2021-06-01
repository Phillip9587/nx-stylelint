import {
  formatFiles,
  joinPathFragments,
  offsetFromRoot,
  readProjectConfiguration,
  updateProjectConfiguration,
  writeJson,
  logger,
} from '@nrwl/devkit';
import type { Tree, GeneratorCallback } from '@nrwl/devkit';
import type { Configuration as StylelintConfiguration } from 'stylelint';
import type { ConfigurationGeneratorSchema } from './schema';
import init from '../init/generator';
import type { LintExecutorSchema } from '../../executors/lint/schema';
import { defaultTargetConfiguration, stylelintConfigFile } from '../../defaults';
import { isStyleExtension } from '../../utils/style-extension';
import { isFormatter, defaultFormatter } from '../../utils/formatter';

interface NormalizedSchema extends ConfigurationGeneratorSchema {
  projectRoot: string;
  stylelintTargetExists: boolean;
}

/** nx-stylelint:configuration generator */
export default async function (host: Tree, options: ConfigurationGeneratorSchema): Promise<void | GeneratorCallback> {
  const initGenerator = await init(host, { skipFormat: options.skipFormat });

  const normalizedOptions = normalizeSchema(host, options);

  if (normalizedOptions.stylelintTargetExists) {
    logger.error(`Project '${options.project}' already has a stylelint target.`);
    return;
  }

  logger.info(`Adding Stylelint configuration and target to '${options.project}' ...\n`);

  createStylelintConfig(host, normalizedOptions);
  addStylelintTarget(host, normalizedOptions);

  if (options.skipFormat !== true) await formatFiles(host);

  return initGenerator;
}

function normalizeSchema(tree: Tree, options: ConfigurationGeneratorSchema): NormalizedSchema {
  const projectConfig = readProjectConfiguration(tree, options.project);

  return {
    ...options,
    format: isFormatter(options.format) ? options.format : defaultFormatter,
    projectRoot: projectConfig.root,
    stylelintTargetExists: projectConfig.targets.stylelint != null,
    style: isStyleExtension(options.style) ? options.style : 'css',
  };
}

function addStylelintTarget(host: Tree, options: NormalizedSchema) {
  const projectConfig = readProjectConfiguration(host, options.project);

  const lintFilePatterns: string[] = [joinPathFragments(options.projectRoot, '**', '*.css')];
  if (options.style !== 'css')
    lintFilePatterns.push(joinPathFragments(options.projectRoot, '**', `*.${options.style}`));

  const targetOptions: Partial<LintExecutorSchema> = {
    config: joinPathFragments(options.projectRoot, stylelintConfigFile),
    lintFilePatterns,
  };

  if (options.format !== 'string') targetOptions.format = options.format;

  projectConfig.targets.stylelint = { ...defaultTargetConfiguration, options: targetOptions };
  updateProjectConfiguration(host, options.project, projectConfig);
}

function createStylelintConfig(host: Tree, options: NormalizedSchema) {
  const config: Partial<StylelintConfiguration> = {
    extends: [joinPathFragments(offsetFromRoot(options.projectRoot), stylelintConfigFile)],
  };

  writeJson(host, joinPathFragments(options.projectRoot, stylelintConfigFile), config);
}
