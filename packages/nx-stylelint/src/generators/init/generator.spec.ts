import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { readJson, updateJson, writeJson, logger } from '@nrwl/devkit';
import type { Tree, NxJsonConfiguration } from '@nrwl/devkit';
import generator from './generator';
import type { InitGeneratorSchema } from './schema';

const defaultOptions: InitGeneratorSchema = {
  skipFormat: false,
};

describe('nx-stylelint:init generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should add dependencies and create recommended root configuration', async () => {
    await generator(tree, defaultOptions);

    const packagejson = readJson(tree, 'package.json');
    expect(packagejson.devDependencies['stylelint']).toBe('^13.12.0');
    expect(packagejson.devDependencies['stylelint-config-idiomatic-order']).toBe('^8.1.0');
    expect(packagejson.devDependencies['stylelint-config-standard']).toBe('^21.0.0');
    expect(packagejson.devDependencies['stylelint-config-prettier']).toBe('^8.0.0');

    const stylelintrc = readJson(tree, '.stylelintrc.json');
    expect(stylelintrc.extends).toContain('stylelint-config-standard');
    expect(stylelintrc.extends).toContain('stylelint-config-idiomatic-order');
    expect(stylelintrc.extends).toContain('stylelint-config-prettier');
    expect(stylelintrc.ignoreFiles).toContain('node_modules/**');
    expect(stylelintrc.ignoreFiles).toContain('dist/**');
    expect(stylelintrc.rules['order/properties-alphabetical-order']).toBeNull();
  });

  it('should skip creation of .stylelintrc.json and recommended dependencies when already present', async () => {
    logger.info = jest.fn();
    writeJson(tree, '.stylelintrc.json', {});

    await generator(tree, defaultOptions);

    expect(logger.info).toHaveBeenCalledWith(
      'Stylelint root configuration found! Skipping creation of root .stylelintrc.json!'
    );

    const packagejson = readJson(tree, 'package.json');
    expect(packagejson.devDependencies['stylelint']).toBe('^13.12.0');
    expect(packagejson.devDependencies['stylelint-config-idiomatic-order']).toBeUndefined();
    expect(packagejson.devDependencies['stylelint-config-prettier']).toBeUndefined();
    expect(packagejson.devDependencies['stylelint-config-standard']).toBeUndefined();
  });

  it('should not add stylelint to devDependencies when present in dependencies', async () => {
    updateJson(tree, 'package.json', (json) => {
      json.dependencies['stylelint'] = 'x.x.x';
      return json;
    });

    let packagejson = readJson(tree, 'package.json');
    expect(packagejson.dependencies['stylelint']).toBe('x.x.x');

    await generator(tree, defaultOptions);

    packagejson = readJson(tree, 'package.json');
    expect(packagejson.dependencies['stylelint']).toBe('x.x.x');
    expect(packagejson.devDependencies['stylelint']).toBeUndefined();
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

  it('should add stylelint vscode extension to vscode extension recommendations when they exist', async () => {
    writeJson(tree, '.vscode/extensions.json', { recommendations: [] });

    await generator(tree, defaultOptions);

    const extensions = readJson(tree, '.vscode/extensions.json');
    expect(extensions.recommendations).toContain('stylelint.vscode-stylelint');
  });

  it('should add stylelint vscode extension and recommendations array to vscode extension file if it exists', async () => {
    writeJson(tree, '.vscode/extensions.json', {});

    await generator(tree, defaultOptions);

    const extensions = readJson(tree, '.vscode/extensions.json');
    expect(extensions.recommendations).toContain('stylelint.vscode-stylelint');
  });

  it('should not add stylelint vscode extension to vscode extension recommendations when it the extension already exists in recommendations', async () => {
    writeJson(tree, '.vscode/extensions.json', { recommendations: ['stylelint.vscode-stylelint'] });

    await generator(tree, defaultOptions);

    const extensions = readJson(tree, '.vscode/extensions.json');
    expect(extensions.recommendations).toHaveLength(1);
    expect(extensions.recommendations).toContain('stylelint.vscode-stylelint');
  });

  it('should add cacheableOperations array with stylelin target to default taks runner in nx.json if it does not exist', async () => {
    updateJson(tree, 'nx.json', (json: NxJsonConfiguration) => {
      const defaultTaskRunner = json.tasksRunnerOptions?.['default'];
      if (defaultTaskRunner) defaultTaskRunner.options.cacheableOperations = undefined;
      return json;
    });
    await generator(tree, defaultOptions);

    const nxjson: NxJsonConfiguration = readJson(tree, 'nx.json');
    expect(nxjson.tasksRunnerOptions?.['default'].options.cacheableOperations).toContain('stylelint');
  });

  it('should not add stylelint targer to cacheableOperations when it already exists', async () => {
    updateJson(tree, 'nx.json', (json: NxJsonConfiguration) => {
      const defaultTaskRunner = json.tasksRunnerOptions?.['default'];
      if (defaultTaskRunner) defaultTaskRunner.options.cacheableOperations = ['stylelint'];
      return json;
    });

    await generator(tree, defaultOptions);

    const nxjson: NxJsonConfiguration = readJson(tree, 'nx.json');
    expect(nxjson.tasksRunnerOptions?.['default'].options.cacheableOperations).toHaveLength(1);
    expect(nxjson.tasksRunnerOptions?.['default'].options.cacheableOperations).toContain('stylelint');
  });

  it('should print warning when the default task runner in nx.json does not exist', async () => {
    logger.warn = jest.fn();
    updateJson(tree, 'nx.json', (json: NxJsonConfiguration) => {
      if (json.tasksRunnerOptions) json.tasksRunnerOptions = undefined;
      return json;
    });

    await generator(tree, defaultOptions);

    expect(logger.warn).toBeCalledWith(
      "Default Task Runner not found. Please add 'stylelint' to the Cacheable Operations of your task runner!\nSee: https://nx.dev/latest/node/core-concepts/configuration#tasks-runner-options"
    );
  });
});
