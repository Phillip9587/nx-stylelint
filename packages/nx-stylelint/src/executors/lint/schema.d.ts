import type { FormatterType } from 'stylelint';

export interface LintExecutorSchema {
  allowEmptyInput: boolean;
  config?: string;
  fix: boolean;
  force: boolean;
  formatter: FormatterType;
  ignoreDisables: boolean;
  lintFilePatterns: string[];
  maxWarnings?: number;
  outputFile?: string;
  reportNeedlessDisables: boolean;
  silent: boolean;
}
