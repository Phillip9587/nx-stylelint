import { LintExecutorSchema } from './schema';
import { ExecutorContext, logger } from '@nrwl/devkit';
import { join } from 'path';
import { writeFileSync } from 'fs';
import { loadStylelint } from './utils';

export default async function runExecutor(
  options: LintExecutorSchema,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  process.chdir(context.cwd);

  const projectName = context.projectName || '<???>';
  const projectRoot = context.projectName ? context.workspace.projects[projectName].root : context.root;

  if (!options.silent) logger.info(`\nLinting Styles "${projectName}"...`);

  const stylelint = await loadStylelint();

  const result = await stylelint.lint({
    configFile: options.config,
    configBasedir: projectRoot,
    files: options.lintFilePatterns,
    reportNeedlessDisables: true,
    // Cast to any to support stylelint tap formatter which is not included in the outdated stylelint types
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formatter: options.format as any,
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
    success: options.force || !result.errored || (options.maxWarnings !== -1 && totalWarnings <= options.maxWarnings),
  };
}
