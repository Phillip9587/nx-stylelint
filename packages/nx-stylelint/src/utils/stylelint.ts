import type * as stylelint from 'stylelint';

export async function loadStylelint(): Promise<stylelint.PublicApi> {
  try {
    return await import('stylelint');
  } catch {
    throw new Error('Unable to find Stylelint. Please ensure Stylelint is installed.');
  }
}
