export function isRelativePath(path: string): boolean {
  return path === '.' || path === '..' || path.startsWith('./') || path.startsWith('../');
}
