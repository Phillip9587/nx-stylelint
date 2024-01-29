import type { GeneratorCallback, Tree } from '@nx/devkit';
import {
  formatFiles,
  joinPathFragments,
  logger,
  offsetFromRoot,
  readProjectConfiguration,
  updateProjectConfiguration,
  writeJson,
} from '@nx/devkit';
import type { Config } from 'stylelint';
import type { LintExecutorSchema } from '../../executors/lint/schema';
import { defaultFormatter, isCoreFormatter } from '../../utils/formatter';
import { initGenerator } from '../init/generator';
import type { ConfigurationGeneratorSchema } from './schema';

interface NormalizedSchema extends ConfigurationGeneratorSchema {
  projectRoot: string;
  stylelintTargetExists: boolean;
}

/** nx-stylelint:configuration generator */
export async function configurationGenerator(
  host: Tree,
  options: ConfigurationGeneratorSchema,
): Promise<void | GeneratorCallback> {
  const init = await initGenerator(host, { skipFormat: options.skipFormat, scss: options.scss });

  const normalizedOptions = normalizeSchema(host, options);

  if (normalizedOptions.stylelintTargetExists) {
    logger.error(`Project '${options.project}' already has a stylelint target.`);
    return;
  }

  logger.info(`Adding Stylelint configuration and target to '${options.project}' ...\n`);

  createStylelintConfig(host, normalizedOptions);
  addStylelintTarget(host, normalizedOptions);

  if (options.skipFormat !== true) await formatFiles(host);

  return init;
}
/** nx-stylelint:configuration generator */
export default configurationGenerator;

function normalizeSchema(tree: Tree, options: ConfigurationGeneratorSchema): NormalizedSchema {
  const projectConfig = readProjectConfiguration(tree, options.project);

  const validFormatter = isCoreFormatter(options.formatter);
  if (options.formatter && !validFormatter) {
    logger.error(
      `Given formatter '${options.formatter}' is not a stylelint core formatter. Falling back to 'string' formatter.`,
    );
  }

  return {
    ...options,
    formatter: validFormatter ? options.formatter : defaultFormatter,
    projectRoot: projectConfig.root,
    stylelintTargetExists: !!projectConfig.targets?.['stylelint'],
  };
}

function addStylelintTarget(tree: Tree, options: NormalizedSchema) {
  const projectConfig = readProjectConfiguration(tree, options.project);

  const targetOptions: Partial<LintExecutorSchema> = {
    lintFilePatterns: [joinPathFragments(options.projectRoot, '**', '*.css')],
    formatter: options.formatter === 'string' ? undefined : options.formatter,
  };

  if (options.scss) {
    targetOptions.lintFilePatterns ??= [];
    targetOptions.lintFilePatterns.push(joinPathFragments(options.projectRoot, '**', '*.scss'));
  }

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

function createStylelintConfig(tree: Tree, options: NormalizedSchema) {
  const config = {
    extends: [joinPathFragments(offsetFromRoot(options.projectRoot), '.stylelintrc.json')],
    ignoreFiles: ['!**/*'],
    overrides: [
      {
        files: ['**/*.css'],
        rules: {},
      },
    ],
  };

  if (options.scss) {
    config.overrides.push({
      files: ['**/*.scss'],
      rules: {},
    });
  }

  writeJson<Config>(tree, joinPathFragments(options.projectRoot, '.stylelintrc.json'), config);
}
