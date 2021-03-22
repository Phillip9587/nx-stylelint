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

export type Formatter = 'compact' | 'json' | 'string' | 'tap' | 'unix' | 'verbose';
