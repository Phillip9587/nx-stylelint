import type { FormatterType } from 'stylelint';

export interface ConfigurationGeneratorSchema {
  formatter?: FormatterType;
  project: string;
  scss?: boolean;
  skipFormat?: boolean;
}
