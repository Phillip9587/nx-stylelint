import { Formatter } from '../../executors/lint/schema';

export interface ConfigurationGeneratorSchema {
  format?: Formatter;
  project: string;
  skipFormat: boolean;
}
