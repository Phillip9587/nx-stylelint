export async function loadStylelint() {
  let stylelint;
  try {
    stylelint = await import('stylelint');
    return stylelint;
  } catch {
    throw new Error('Unable to find Stylelint. Ensure Stylelint is installed.');
  }
}
