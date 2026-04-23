import type { lint } from 'stylelint';

export async function loadStylelintLint(): Promise<typeof lint> {
  return (await import('stylelint')).lint;
}
