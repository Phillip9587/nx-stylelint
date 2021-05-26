const StyleExtensions = ['css', 'scss', 'less'] as const;
export type StyleExtension = typeof StyleExtensions[number];

export function isStyleExtension(style: unknown): style is StyleExtension {
  if (typeof style !== 'string') return false;
  return StyleExtensions.includes(style as StyleExtension);
}
