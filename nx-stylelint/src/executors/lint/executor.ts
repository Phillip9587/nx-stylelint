import type { ExecutorContext } from '@nx/devkit';
import { logger } from '@nx/devkit';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { loadFormatter } from '../../utils/formatter';
import { loadStylelint } from '../../utils/stylelint';
import type { LintExecutorSchema } from './schema';

export async function lintExecutor(
  options: LintExecutorSchema,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  process.chdir(context.cwd);

  let stylelint: typeof import('stylelint');
  try {
    stylelint = await loadStylelint();
  } catch (error) {
    logger.error(error instanceof Error ? error.message : error);
    return { success: false };
  }

  const projectName = context.projectName || '<???>';

  if (options.configFile && !existsSync(options.configFile)) {
    logger.error('The given stylelint config file does not exist.');
    return { success: false };
  }

  if (!options.silent) logger.info(`\nLinting Styles "${projectName}"...`);

  let resolvedFormatter;
  try {
    resolvedFormatter = loadFormatter(options.formatter, context.cwd);
  } catch (err) {
    logger.error(`Invalid Formatter. More Details: \n`);
    throw err;
  }

  const result = await stylelint.lint({
    ...options,
    files: options.lintFilePatterns,
    formatter: resolvedFormatter,
    maxWarnings: options.maxWarnings ? options.maxWarnings : undefined,
  });

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
