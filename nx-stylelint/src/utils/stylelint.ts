export async function loadStylelint(): Promise<typeof import('stylelint')> {
  try {
    return await import('stylelint');
  } catch {
    throw new Error('Unable to find Stylelint. Please ensure Stylelint is installed.');
  }
}
