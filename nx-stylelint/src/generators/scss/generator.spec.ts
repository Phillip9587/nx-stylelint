import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { readProjectConfiguration, readJson, logger } from '@nx/devkit';
import type { Tree } from '@nx/devkit';
import { libraryGenerator } from '@nx/js';
import { configurationGenerator } from '../configuration/generator';
import { scssGenerator } from './generator';
import type { ScssGeneratorSchema } from './schema';
import { Config } from 'stylelint';

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
    tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
  });

  it('should add a a glob pattern for scss files to the target configuration', async () => {
    await libraryGenerator(tree, { name: 'test', compiler: 'tsc' });
    await configurationGenerator(tree, { project: 'test', skipFormat: true });
    await scssGenerator(tree, defaultOptions);

    const config = readProjectConfiguration(tree, 'test');

    expect(config).toBeDefined();
    expect(config.targets?.['stylelint']).toBeDefined();
    expect(config.targets?.['stylelint'].executor).toBe('nx-stylelint:lint');
    expect(config.targets?.['stylelint'].options.lintFilePatterns).toContain('libs/test/**/*.css');
    expect(config.targets?.['stylelint'].options.lintFilePatterns).toContain('libs/test/**/*.scss');
  });

  it('should add required dependencies to package.json', async () => {
    await libraryGenerator(tree, { name: 'test', compiler: 'tsc' });
    await configurationGenerator(tree, { project: 'test', skipFormat: true });
    await scssGenerator(tree, defaultOptions);

    const packageJson = readJson(tree, 'package.json');

    expect(packageJson.devDependencies['stylelint-config-standard-scss']).toBe('^11.0.0');
  });

  it('should update root and project stylelint configurations', async () => {
    const projectStylelint = `libs/test/.stylelintrc.json`;

    await libraryGenerator(tree, { name: 'test', compiler: 'tsc' });
    await configurationGenerator(tree, { project: 'test', skipFormat: true });

    expect(tree.exists('.stylelintrc.json')).toBeTruthy();
    expect(tree.exists(projectStylelint)).toBeTruthy();
    let rootConfig = readJson<Config>(tree, '.stylelintrc.json');
    expect(rootConfig.overrides).toStrictEqual([
      {
        files: ['**/*.css'],
        extends: ['stylelint-config-standard'],
        rules: {},
      },
    ]);

    let projectConfig = readJson<Config>(tree, projectStylelint);
    expect(projectConfig.overrides).toStrictEqual([
      {
        files: ['**/*.css'],
        rules: {},
      },
    ]);

    await scssGenerator(tree, defaultOptions);

    rootConfig = readJson<Config>(tree, '.stylelintrc.json');
    expect(rootConfig.overrides).toStrictEqual([
      {
        files: ['**/*.css'],
        extends: ['stylelint-config-standard'],
        rules: {},
      },
      {
        files: ['**/*.scss'],
        extends: ['stylelint-config-standard-scss'],
        rules: {},
      },
    ]);

    projectConfig = readJson<Config>(tree, projectStylelint);
    expect(projectConfig.overrides).toStrictEqual([
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
