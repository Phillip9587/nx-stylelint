export async function loadMiniMatch(): Promise<typeof import('minimatch')> {
  try {
    return await import('minimatch');
  } catch {
    throw new Error('Unable to find Stylelint. Please ensure Stylelint is installed.');
  }
}
