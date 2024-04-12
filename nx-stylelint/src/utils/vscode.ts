import { type Tree, updateJson } from '@nx/devkit';

/** Stylelint Visual Studio Code plugin identifier */
export const STYLELINT_VSCODE_EXTENSION_IDENTIFIER = 'stylelint.vscode-stylelint';

/** Adds the Stylelint VSCode Extension to the recommenden Extensions if the file exists */
export function addStylelintVSCodeExtension(tree: Tree, path = '.vscode/extensions.json'): void {
  if (!tree.exists(path)) return;

  updateJson(tree, path, (json: { [key: string]: unknown }) => {
    if (typeof json === 'object' && json) {
      json['recommendations'] ??= [];

      if (
        Array.isArray(json['recommendations']) &&
        !json['recommendations'].includes(STYLELINT_VSCODE_EXTENSION_IDENTIFIER)
      )
        json['recommendations'].push(STYLELINT_VSCODE_EXTENSION_IDENTIFIER);
    }

    return json as object;
  });
}
