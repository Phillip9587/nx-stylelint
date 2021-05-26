import type { Formatter } from '../../utils/formatter';
import type { StyleExtension } from '../../utils/style-extension';

export interface ConfigurationGeneratorSchema {
  format?: Formatter;
  project: string;
  skipFormat: boolean;
  style: StyleExtension;
}
