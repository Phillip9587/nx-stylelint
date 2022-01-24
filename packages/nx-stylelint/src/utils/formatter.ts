import type { FormatterType } from 'stylelint';

export const defaultFormatter: FormatterType = 'string';
export const formatters: string[] = ['compact', 'json', 'string', 'tap', 'unix', 'verbose'];

export function isFormatter(formatter: unknown): formatter is FormatterType {
  if (typeof formatter !== 'string') return false;
  return formatters.includes(formatter);
}
