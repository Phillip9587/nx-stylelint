const Formatters = ['compact', 'json', 'string', 'tap', 'unix', 'verbose'] as const;
export type Formatter = typeof Formatters[number];

export const defaultFormatter: Formatter = 'string';

export function isFormatter(formatter: unknown): formatter is Formatter {
  if (typeof formatter !== 'string') return false;
  return Formatters.includes(formatter as Formatter);
}
