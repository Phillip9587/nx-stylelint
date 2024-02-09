import { existsSync } from 'node:fs';
import { isAbsolute, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import type { Formatter, FormatterType } from 'stylelint';
import { formatters } from 'stylelint';

export const defaultFormatter: FormatterType = 'string';

const formatterKeys = Object.keys(formatters);
export function isCoreFormatter(formatter: unknown): formatter is FormatterType {
  if (!formatter || typeof formatter !== 'string') return false;
  return formatterKeys.includes(formatter);
}

export async function importFormatter(formatter: unknown): Promise<FormatterType | Formatter> {
  if (!formatter || typeof formatter !== 'string') throw new Error('Formatter must be a string!');
  if (isCoreFormatter(formatter)) return formatter;

  let moduleOrFilePath = formatter;
  if (existsSync(moduleOrFilePath)) moduleOrFilePath = resolve(moduleOrFilePath);

  return await import(
    isAbsolute(moduleOrFilePath) ? pathToFileURL(moduleOrFilePath).toString() : moduleOrFilePath
  ).then((m) => m.default);
}
