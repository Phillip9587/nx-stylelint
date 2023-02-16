import * as path from 'path';
import type { Formatter, FormatterType } from 'stylelint';
import * as stylelint from 'stylelint';

export const defaultFormatter: FormatterType = 'string';

const formatterKeys = Object.keys((stylelint as any).formatters);
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
    return require(isNpmPackage ? normalizedFormatter : path.join(cwd, normalizedFormatter));
  } catch (err) {
    if (isNpmPackage && !normalizedFormatter.includes('@')) {
      return require(path.join(cwd, normalizedFormatter));
    }
    throw err;
  }
}
