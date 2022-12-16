import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { readJson, updateJson, writeJson, logger } from '@nrwl/devkit';
import type { Tree, NxJsonConfiguration } from '@nrwl/devkit';
import type { Config } from 'stylelint';
import generator from './generator';
import type { InitGeneratorSchema } from './schema';

const defaultOptions: InitGeneratorSchema = {
  skipFormat: false,
};

describe('nx-stylelint:init generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
  });

  it('should add dependencies and create recommended root configuration', async () => {
    await generator(tree, defaultOptions);

    const packagejson = readJson(tree, 'package.json');
    expect(packagejson.devDependencies['stylelint']).toBe('^14.10.0');
    expect(packagejson.devDependencies['stylelint-config-standard']).toBe('^25.0.0');
    expect(packagejson.devDependencies['stylelint-config-prettier']).toBe('^9.0.3');

    const stylelintrc = readJson<Config>(tree, '.stylelintrc.json');
    expect(stylelintrc.ignoreFiles?.length).toBe(1);
    expect(stylelintrc.ignoreFiles).toContain('**/*');
  });

  it('should skip creation of .stylelintrc.json and recommended dependencies when already present', async () => {
    logger.info = jest.fn();
    writeJson(tree, '.stylelintrc.json', {});

    await generator(tree, defaultOptions);

    expect(logger.info).toHaveBeenCalledWith(
      `Stylelint root configuration found! Skipping creation of root .stylelintrc.json!

Please be aware that your own configuration can lead to problems with nx-stylelint's behavior!
We recommend renaming your custom '.stylelintrc.json' file and running the generator again with 'nx g nx-stylelint:init'.
You can then migrate your custom rule configuration into the created stylelint configuration.`
    );

    const packagejson = readJson(tree, 'package.json');
    expect(packagejson.devDependencies['stylelint']).toBe('^14.10.0');
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

  describe('targetDefaults', () => {
    it('should add targetDefaults for stylelint', async () => {
      updateJson<NxJsonConfiguration>(tree, 'nx.json', (json) => {
        json.namedInputs ??= {};
        json.namedInputs.production = ['default'];
        return json;
      });

      await generator(tree, defaultOptions);

      const nxConfig = readJson<NxJsonConfiguration>(tree, 'nx.json');

      expect(nxConfig.targetDefaults?.stylelint).toStrictEqual({
        inputs: ['default', `{workspaceRoot}/.stylelintrc(.(json|yml|yaml|js))?`],
      });
      expect(nxConfig.namedInputs?.production).toContain(`!{projectRoot}/.stylelintrc(.(json|yml|yaml|js))?`);
    });

    it('should not create namedInputs production fileset if not present', async () => {
      updateJson<NxJsonConfiguration>(tree, 'nx.json', (json) => {
        json.namedInputs ??= {};
        delete json.namedInputs.production;
        return json;
      });

      await generator(tree, defaultOptions);

      const nxConfig = readJson<NxJsonConfiguration>(tree, 'nx.json');

      expect(nxConfig.namedInputs?.production).toBeUndefined();
    });
  });

  describe('VSCode Extension', () => {
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
  });

  describe('Task Runner', () => {
    it('should add cacheableOperations array with stylelint target to default taks runner in nx.json if it does not exist', async () => {
      updateJson(tree, 'nx.json', (json: NxJsonConfiguration) => {
        const defaultTaskRunner = json.tasksRunnerOptions?.['default'];
        if (defaultTaskRunner) defaultTaskRunner.options.cacheableOperations = undefined;
        return json;
      });
      await generator(tree, defaultOptions);

      const nxjson: NxJsonConfiguration = readJson(tree, 'nx.json');
      expect(nxjson.tasksRunnerOptions?.['default'].options.cacheableOperations).toContain('stylelint');
    });

    it('should not add stylelint target to cacheableOperations when it already exists', async () => {
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
});
