import type { Tree } from '@nx/devkit';
import { readJson, writeJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { addStylelintVSCodeExtension } from './vscode';

describe(addStylelintVSCodeExtension.name, () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
  });

  it('should add stylelint vscode extension to vscode extension recommendations when they exist', async () => {
    writeJson(tree, '.vscode/extensions.json', { recommendations: [] });

    addStylelintVSCodeExtension(tree);

    const extensions = readJson(tree, '.vscode/extensions.json');
    expect(extensions.recommendations).toContain('stylelint.vscode-stylelint');
  });

  it('should add stylelint vscode extension and recommendations array to vscode extension file if it exists', async () => {
    writeJson(tree, '.vscode/extensions.json', {});

    addStylelintVSCodeExtension(tree);

    const extensions = readJson(tree, '.vscode/extensions.json');
    expect(extensions.recommendations).toContain('stylelint.vscode-stylelint');
  });

  it('should not add stylelint vscode extension to vscode extension recommendations when it the extension already exists in recommendations', async () => {
    writeJson(tree, '.vscode/extensions.json', { recommendations: ['stylelint.vscode-stylelint'] });

    addStylelintVSCodeExtension(tree);

    const extensions = readJson(tree, '.vscode/extensions.json');
    expect(extensions.recommendations).toHaveLength(1);
    expect(extensions.recommendations).toContain('stylelint.vscode-stylelint');
  });
});
