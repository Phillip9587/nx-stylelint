import type { FormatterType } from 'stylelint';

export interface ConfigurationGeneratorSchema {
  formatter?: FormatterType;
  project: string;
  skipFormat: boolean;
}
