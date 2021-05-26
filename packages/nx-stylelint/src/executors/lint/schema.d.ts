import type { Formatter } from '../../utils/formatter';
export interface LintExecutorSchema {
  config: string;
  fix: boolean;
  force: boolean;
  format: Formatter;
  lintFilePatterns: string[];
  maxWarnings: number;
  outputFile?: string;
  silent: boolean;
}
