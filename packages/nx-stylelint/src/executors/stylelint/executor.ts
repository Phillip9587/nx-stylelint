import { StylelintExecutorSchema } from './schema';
import { lint, LinterResult } from 'stylelint';
import { ExecutorContext, logger } from '@nrwl/devkit';
import { join } from 'path';
import { writeFileSync } from 'fs';

export default async function runExecutor(
  options: StylelintExecutorSchema,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  process.chdir(context.cwd);

  const projectName = context.projectName || '<???>';
  const workspaceRoot = context.root;

  if (!options.silent) logger.info(`\nLinting Styles "${projectName}"...`);

  const result: LinterResult = await lint({
    configFile: options.config,
    configBasedir: workspaceRoot,
    files: options.lintFilePatterns,
    reportNeedlessDisables: true,
    formatter: options.format,
    fix: options.fix,
  });

  let totalErrors = 0;
  let totalWarnings = 0;

  for (const r of result.results) {
    for (const w of r.warnings) {
      if (w.severity === 'error') totalErrors++;
      else totalWarnings++;
    }
  }

  if (options.outputFile) {
    const outputFilePath = join(context.root, options.outputFile);
    writeFileSync(outputFilePath, result.output);
  } else {
    logger.info(result.output);
  }

  if (totalWarnings > 0 && !options.silent) logger.warn('\nLint warnings found in the listed files.');

  if (totalErrors > 0 && !options.silent) logger.error('\nLint errors found in the listed files.');

  if (totalWarnings === 0 && totalErrors === 0 && !options.silent) logger.info('\nAll files pass linting.');

  return {
    success: options.force || result.errored || options.maxWarnings === -1 || totalWarnings <= options.maxWarnings,
  };
}
