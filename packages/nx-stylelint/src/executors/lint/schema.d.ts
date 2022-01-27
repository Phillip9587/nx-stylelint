import type { FormatterType } from 'stylelint';

export interface LintExecutorSchema {
  allowEmptyInput: boolean;
  cache: boolean;
  cacheLocation?: string;
  configFile?: string;
  fix: boolean;
  force: boolean;
  formatter: FormatterType | string;
  ignoreDisables: boolean;
  ignorePath?: string;
  lintFilePatterns: string[];
  maxWarnings?: number;
  outputFile?: string;
  quiet: boolean;
  reportDescriptionlessDisables: boolean;
  reportInvalidScopeDisables: boolean;
  reportNeedlessDisables: boolean;
  silent: boolean;
}
