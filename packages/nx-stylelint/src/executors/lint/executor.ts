import { execSync } from 'child_process';
import type { LintExecutorSchema } from './schema';
import { logger } from '@nrwl/devkit';
import type { ExecutorContext } from '@nrwl/devkit';
import { join, dirname } from 'path';
import { existsSync, writeFileSync, mkdirSync } from 'fs';
import { loadStylelint } from '../../utils/stylelint';
import { loadFormatter } from '../../utils/formatter';

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

  const files = options.uncommitted ? getUncommittedFiles() : options.lintFilePatterns;

  let resolvedFormatter;
  try {
    resolvedFormatter = loadFormatter(options.formatter, context.cwd);
  } catch (err) {
    logger.error(`Invalid Formatter. More Details: \n`);
    throw err;
  }

  const result = await stylelint.lint({
    ...options,
    files: files,
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


function getUncommittedFiles(): string[] {
  return parseGitOutput(`git diff --name-only --relative HEAD .`);
}

function parseGitOutput(command: string): string[] {
  return execSync(command, { maxBuffer: TEN_MEGABYTES })
    .toString('utf-8')
    .split('\n')
    .map((a) => a.trim())
    .filter((a) => a.length > 0);
}


export default lintExecutor;
