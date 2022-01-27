import * as path from 'path';
import type { Formatter, FormatterType } from 'stylelint';

export const defaultFormatter: FormatterType = 'string';
export const formatters: string[] = ['compact', 'json', 'string', 'tap', 'unix', 'verbose'];

export function isCoreFormatter(formatter: unknown): formatter is FormatterType {
  if (!formatter || typeof formatter !== 'string') return false;
  return formatters.includes(formatter);
}

export function loadFormatter(formatter: unknown, root: string): FormatterType | Formatter | null {
  if (!formatter || typeof formatter !== 'string') return null;
  if (isCoreFormatter(formatter)) return formatter;

  return require(path.resolve(root, formatter));
}
