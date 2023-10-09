import { join } from 'node:path';
import type { Formatter, FormatterType } from 'stylelint';
import { formatters } from 'stylelint';

export const defaultFormatter: FormatterType = 'string';

const formatterKeys = Object.keys(formatters);
export function isCoreFormatter(formatter: unknown): formatter is FormatterType {
  if (!formatter || typeof formatter !== 'string') return false;
  return formatterKeys.includes(formatter);
}

const npmPackageRegex = /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/;

export function loadFormatter(formatter: unknown, cwd: string): FormatterType | Formatter {
  if (!formatter || typeof formatter !== 'string') throw new Error('Formatter must be a string!');
  const normalizedFormatter: string = formatter.trim().replace(/\\/gu, '/');
  if (isCoreFormatter(normalizedFormatter)) return normalizedFormatter;

  const isNpmPackage = npmPackageRegex.test(normalizedFormatter);

  try {
    return require(isNpmPackage ? normalizedFormatter : join(cwd, normalizedFormatter));
  } catch (err) {
    if (isNpmPackage && !normalizedFormatter.includes('@')) {
      return require(join(cwd, normalizedFormatter));
    }
    throw err;
  }
}
