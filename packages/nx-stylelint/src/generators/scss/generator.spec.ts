import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { readProjectConfiguration, readJson, logger } from '@nrwl/devkit';
import type { Tree } from '@nrwl/devkit';
import { libraryGenerator } from '@nrwl/node';
import { configurationGenerator } from '../configuration/generator';
import { scssGenerator } from './generator';
import type { ScssGeneratorSchema } from './schema';
import { Config, ConfigOverride } from 'stylelint';

const defaultOptions: ScssGeneratorSchema = {
  project: 'test',
  skipFormat: false,
};

describe('scss generator', () => {
  let tree: Tree;

  beforeAll(async () => {
    logger.info = jest.fn();
  });

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should add a a glob pattern for scss files to the target configuration', async () => {
    await libraryGenerator(tree, { name: 'test', compiler: 'tsc' });
    await configurationGenerator(tree, { project: 'test', skipFormat: true });
    await scssGenerator(tree, defaultOptions);

    const config = readProjectConfiguration(tree, 'test');

    expect(config).toBeDefined();
    expect(config.targets?.stylelint).toBeDefined();
    expect(config.targets?.stylelint.executor).toBe('nx-stylelint:lint');
    expect(config.targets?.stylelint.options.lintFilePatterns).toContain('libs/test/**/*.css');
    expect(config.targets?.stylelint.options.lintFilePatterns).toContain('libs/test/**/*.scss');
  });

  it('should add required dependencies to package.json', async () => {
    await libraryGenerator(tree, { name: 'test', compiler: 'tsc' });
    await configurationGenerator(tree, { project: 'test', skipFormat: true });
    await scssGenerator(tree, defaultOptions);

    const packageJson = readJson(tree, 'package.json');

    expect(packageJson.devDependencies['stylelint-config-standard-scss']).toBe('^4.0.0');
  });

  it('should update root and project stylelint configurations', async () => {
    const projectStylelint = `libs/test/.stylelintrc.json`;

    await libraryGenerator(tree, { name: 'test', compiler: 'tsc' });
    await configurationGenerator(tree, { project: 'test', skipFormat: true });

    expect(tree.exists('.stylelintrc.json')).toBeTruthy();
    expect(tree.exists(projectStylelint)).toBeTruthy();
    let rootConfig = readJson<Config>(tree, '.stylelintrc.json');
    expect(rootConfig.overrides).toStrictEqual<ConfigOverride[]>([
      {
        files: ['**/*.css'],
        extends: ['stylelint-config-standard', 'stylelint-config-prettier'],
        rules: {},
      },
    ]);

    let projectConfig = readJson<Config>(tree, projectStylelint);
    expect(projectConfig.overrides).toStrictEqual<ConfigOverride[]>([
      {
        files: ['**/*.css'],
        rules: {},
      },
    ]);

    await scssGenerator(tree, defaultOptions);

    rootConfig = readJson<Config>(tree, '.stylelintrc.json');
    expect(rootConfig.overrides).toStrictEqual<ConfigOverride[]>([
      {
        files: ['**/*.css'],
        extends: ['stylelint-config-standard', 'stylelint-config-prettier'],
        rules: {},
      },
      {
        files: ['**/*.scss'],
        extends: ['stylelint-config-standard-scss', 'stylelint-config-prettier'],
        rules: {},
      },
    ]);

    projectConfig = readJson<Config>(tree, projectStylelint);
    expect(projectConfig.overrides).toStrictEqual<ConfigOverride[]>([
      {
        files: ['**/*.css'],
        rules: {},
      },
      {
        files: ['**/*.scss'],
        rules: {},
      },
    ]);
  });
});
