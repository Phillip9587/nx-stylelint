import { formatters } from 'stylelint';
import type { FormatterType } from 'stylelint';

export const defaultFormatter: FormatterType = 'string';

export function isFormatter(formatter: unknown): formatter is FormatterType {
  if (typeof formatter !== 'string') return false;
  return Object.keys(formatters).includes(formatter);
}
