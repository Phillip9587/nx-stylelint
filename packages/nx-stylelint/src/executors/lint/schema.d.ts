import type { FormatterType } from 'stylelint';

export interface LintExecutorSchema {
  config: string;
  fix: boolean;
  force: boolean;
  formatter: FormatterType;
  lintFilePatterns: string[];
  maxWarnings?: number;
  outputFile?: string;
  silent: boolean;
}
