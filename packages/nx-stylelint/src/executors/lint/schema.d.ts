export interface LintExecutorSchema {
  config: string;
  lintFilePatterns: string[];
  format: Formatter;
  silent: boolean;
  force: boolean;
  fix: boolean;
  maxWarnings: number;
  outputFile?: string;
}

export type Formatter = 'compact' | 'json' | 'string' | 'tap' | 'unix' | 'verbose';
