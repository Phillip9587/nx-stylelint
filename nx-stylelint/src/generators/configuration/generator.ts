import type { GeneratorCallback, Tree } from '@nx/devkit';
import {
  formatFiles,
  joinPathFragments,
  logger,
  readProjectConfiguration,
  updateProjectConfiguration,
} from '@nx/devkit';
import type { FormatterType } from 'stylelint';
import type { LintExecutorSchema } from '../../executors/lint/schema';
import { createProjectStylelintConfigFile } from '../../utils/config-file';
import { defaultFormatter, isCoreFormatter } from '../../utils/formatter';
import { initGenerator } from '../init/generator';
import type { ConfigurationGeneratorSchema } from './schema';

interface NormalizedSchema extends Required<ConfigurationGeneratorSchema> {
  projectRoot: string;
  stylelintTargetExists: boolean;
}

/** nx-stylelint:configuration generator */
export async function configurationGenerator(
  host: Tree,
  options: ConfigurationGeneratorSchema
): Promise<void | GeneratorCallback> {
  const init = await initGenerator(host, { skipFormat: options.skipFormat, scss: options.scss });

  const normalizedOptions = normalizeSchema(host, options);

  if (normalizedOptions.stylelintTargetExists) {
    logger.error(`Project '${options.project}' already has a stylelint target.`);
    return;
  }

  logger.info(`Adding Stylelint configuration and target to '${options.project}' ...\n`);

  createProjectStylelintConfigFile(host, normalizedOptions.projectRoot, normalizedOptions.scss);
  addTarget(host, normalizedOptions);

  if (options.skipFormat !== true) await formatFiles(host);

  return init;
}
/** nx-stylelint:configuration generator */
export default configurationGenerator;

function normalizeSchema(tree: Tree, options: ConfigurationGeneratorSchema): NormalizedSchema {
  const projectConfig = readProjectConfiguration(tree, options.project);

  let formatter: FormatterType = defaultFormatter;
  if (isCoreFormatter(options.formatter)) {
    formatter = options.formatter;
  } else if (options.formatter) {
    logger.error(
      `Given formatter '${options.formatter}' is not a stylelint core formatter. Falling back to '${defaultFormatter}' formatter.`
    );
  }

  return {
    project: options.project,
    formatter,
    scss: !!options.scss,
    skipFormat: !!options.skipFormat,
    projectRoot: projectConfig.root,
    stylelintTargetExists: !!projectConfig.targets?.['stylelint'],
  };
}

function addTarget(tree: Tree, options: NormalizedSchema) {
  const projectConfig = readProjectConfiguration(tree, options.project);

  const targetOptions = {
    lintFilePatterns: [joinPathFragments(options.projectRoot, '**', '*.css')],
    formatter: options.formatter === 'string' ? undefined : options.formatter,
  } satisfies Partial<LintExecutorSchema>;

  if (options.scss) targetOptions.lintFilePatterns.push(joinPathFragments(options.projectRoot, '**', '*.scss'));

  projectConfig.targets = {
    ...projectConfig.targets,
    stylelint: {
      executor: 'nx-stylelint:lint',
      outputs: ['{options.outputFile}'],
      options: targetOptions,
    },
  };
  updateProjectConfiguration(tree, options.project, projectConfig);
}
