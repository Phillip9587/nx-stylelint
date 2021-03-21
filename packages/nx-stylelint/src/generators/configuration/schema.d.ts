import { Formatter } from '../../executors/lint/schema';

export interface ConfigurationGeneratorSchema {
  project: string;
  format?: Formatter;
  skipFormat: boolean;
}
