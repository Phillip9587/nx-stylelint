import type { LintExecutorSchema } from './schema';
import { logger } from '@nrwl/devkit';
import type { ExecutorContext } from '@nrwl/devkit';
import { join } from 'path';
import { writeFileSync } from 'fs';
import { loadStylelint } from '../../utils/stylelint';
import type { LinterOptions, LinterResult } from 'stylelint';
import { isFormatter, defaultFormatter } from '../../utils/formatter';

export async function lintExecutor(
  options: LintExecutorSchema,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  let stylelint;
  try {
    stylelint = await loadStylelint();
  } catch (error) {
    logger.error(error instanceof Error ? error.message : error);
    return { success: false };
  }

  const projectName = context.projectName || '<???>';
  const projectRoot = context.projectName ? context.workspace.projects[projectName].root : context.root;

  if (!options.silent) logger.info(`\nLinting Styles "${projectName}"...`);

  const stylelintOptions: Partial<LinterOptions> = {
    configFile: options.config,
    configBasedir: projectRoot,
    files: options.lintFilePatterns,
    reportNeedlessDisables: true,
    // Cast to any to support stylelint tap formatter which is not included in the outdated stylelint types
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formatter: isFormatter(options.format) ? (options.format as any) : defaultFormatter,
    fix: options.fix,
  };

  const result: LinterResult = await stylelint.lint(stylelintOptions);

  const totalWarnings = result.results
    .map((r) => r.warnings.filter((w) => w.severity === 'warning'))
    .reduce((prev, r) => prev + r.length, 0);

  if (options.outputFile) {
    const outputFilePath = join(context.root, options.outputFile);
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
      (result.errored === false && (options.maxWarnings === -1 || totalWarnings <= options.maxWarnings)),
  };
}

export default lintExecutor;
