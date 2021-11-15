import type { LintExecutorSchema } from './schema';
import { logger } from '@nrwl/devkit';
import type { ExecutorContext } from '@nrwl/devkit';
import { join, dirname } from 'path';
import { existsSync, writeFileSync, mkdirSync } from 'fs';
import { loadStylelint } from '../../utils/stylelint';
import type { LinterOptions, LinterResult, PublicApi as StylelintPublicApi } from 'stylelint';
import { isFormatter, defaultFormatter } from '../../utils/formatter';

export async function lintExecutor(
  options: LintExecutorSchema,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  let stylelint: StylelintPublicApi;
  try {
    stylelint = await loadStylelint();
  } catch (error) {
    logger.error(error instanceof Error ? error.message : error);
    return { success: false };
  }

  const projectName = context.projectName || '<???>';
  const projectRoot = context.projectName ? context.workspace.projects[projectName].root : context.root;

  if (!existsSync(options.config)) {
    logger.error('The given stylelint config file does not exist.');
    return { success: false };
  }

  if (!options.silent) logger.info(`\nLinting Styles "${projectName}"...`);

  const validFormatter = isFormatter(options.formatter);
  if (!validFormatter)
    logger.warn(`Configured format is not a valid stylelint formatter. Falling back to the default formatter.`);

  const stylelintOptions: LinterOptions = {
    configFile: options.config,
    configBasedir: projectRoot,
    files: options.lintFilePatterns,
    reportNeedlessDisables: true,
    // Cast to any to support stylelint tap formatter which is not included in the outdated stylelint types
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formatter: validFormatter ? options.formatter : defaultFormatter,
    fix: options.fix,
    maxWarnings: options.maxWarnings ? options.maxWarnings : undefined,
  };

  const result: LinterResult = await stylelint.lint(stylelintOptions);

  const totalWarnings = result.results
    .map((r) => r.warnings.filter((w) => w.severity === 'warning'))
    .reduce((prev, r) => prev + r.length, 0);

  if (options.outputFile) {
    const outputFilePath = join(context.root, options.outputFile);
    mkdirSync(dirname(outputFilePath), { recursive: true });
    writeFileSync(outputFilePath, result.output);
  } else if (!options.silent) {
    logger.info(result.output);
  }

  if (totalWarnings > 0 && !options.silent) logger.warn('\nLint warnings found in the listed files.');

  if (result.errored && !options.silent) logger.error('\nLint errors found in the listed files.');

  if (totalWarnings === 0 && !result.errored && !options.silent) logger.info('\nAll files pass linting.');

  return {
    success:
      options.force ||
      (result.errored === false &&
        (options.maxWarnings === undefined || options.maxWarnings === -1 || totalWarnings <= options.maxWarnings)),
  };
}

export default lintExecutor;
