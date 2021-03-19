import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readJson, updateJson, writeJson, logger } from '@nrwl/devkit';

import generator from './generator';
import { InitGeneratorSchema } from './schema';

const defaultOptions: InitGeneratorSchema = {
  skipFormat: false,
};

describe('nx-stylelint:init generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should add dependencies', async () => {
    await generator(tree, defaultOptions);

    const packagejson = readJson(tree, 'package.json');
    expect(packagejson.dependencies['stylelint']).toBeUndefined();
    expect(packagejson.devDependencies['stylelint']).toBe('^13.12.0');
    expect(packagejson.devDependencies['stylelint-config-standard']).toBe('^21.0.0');
    expect(packagejson.devDependencies['stylelint-config-idiomatic-order']).toBe('^8.1.0');
    expect(packagejson.devDependencies['stylelint-config-prettier']).toBe('^8.0.0');
  });

  it('should skip when root .stylelintrc.json already present', async () => {
    logger.info = jest.fn();
    writeJson(tree, '.stylelintrc.json', {});

    await generator(tree, defaultOptions);

    expect(logger.info).toHaveBeenCalledWith('Stylelint root configuration found! Skipping init!\n');
    const packagejson = readJson(tree, 'package.json');
    expect(packagejson.dependencies['stylelint']).toBeUndefined();
    expect(packagejson.devDependencies['stylelint']).toBeUndefined();
    expect(packagejson.devDependencies['stylelint-config-standard']).toBeUndefined();
    expect(packagejson.devDependencies['stylelint-config-idiomatic-order']).toBeUndefined();
    expect(packagejson.devDependencies['stylelint-config-prettier']).toBeUndefined();
  });

  it('should remove stylelint from dependencies and add it to devDependencies', async () => {
    updateJson(tree, 'package.json', (json) => {
      json.dependencies['stylelint'] = 'x.x.x';
      return json;
    });

    let packagejson = readJson(tree, 'package.json');
    expect(packagejson.dependencies['stylelint']).toBe('x.x.x');

    await generator(tree, defaultOptions);

    packagejson = readJson(tree, 'package.json');
    expect(packagejson.dependencies['stylelint']).toBeUndefined();
    expect(packagejson.devDependencies['stylelint']).toBe('^13.12.0');
    expect(packagejson.devDependencies['stylelint-config-standard']).toBe('^21.0.0');
    expect(packagejson.devDependencies['stylelint-config-idiomatic-order']).toBe('^8.1.0');
    expect(packagejson.devDependencies['stylelint-config-prettier']).toBe('^8.0.0');
  });

  it('should create root .stylelintrc.json with default config', async () => {
    await generator(tree, defaultOptions);

    const stylelintrc = readJson(tree, '.stylelintrc.json');
    expect(stylelintrc.extends).toContain('stylelint-config-standard');
    expect(stylelintrc.extends).toContain('stylelint-config-idiomatic-order');
    expect(stylelintrc.extends).toContain('stylelint-config-prettier');
    expect(stylelintrc.ignoreFiles).toContain('node_modules/**');
    expect(stylelintrc.ignoreFiles).toContain('dist/**');
    expect(stylelintrc.rules['order/properties-alphabetical-order']).toBeNull();
  });

  it('should add stylelint config to implicitDependencies in nx.json', async () => {
    await generator(tree, defaultOptions);

    const nxConfig = readJson(tree, 'nx.json');
    expect(nxConfig.implicitDependencies['.stylelintrc.json']).toBe('*');
  });

  it('should add stylelint target to cacheableOperations in nx.json', async () => {
    await generator(tree, defaultOptions);

    const nxConfig = readJson(tree, 'nx.json');
    expect(nxConfig.tasksRunnerOptions.default.options.cacheableOperations).toContain('stylelint');
  });

  it('should add stylelint vscode extensions to vscode extension recommendations when they exist', async () => {
    writeJson(tree, '.vscode/extensions.json', { recommendations: [] });

    await generator(tree, defaultOptions);

    const extensions = readJson(tree, '.vscode/extensions.json');
    expect(extensions.recommendations).toContain('stylelint.vscode-stylelint');
  });
});
