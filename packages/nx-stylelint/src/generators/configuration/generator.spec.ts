import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { readProjectConfiguration, readJson, logger } from '@nrwl/devkit';
import type { Tree } from '@nrwl/devkit';
import { libraryGenerator } from '@nrwl/node';
import type { Configuration as StylelintConfiguration } from 'stylelint';

import generator from './generator';
import { ConfigurationGeneratorSchema } from './schema';

const defaultOptions: ConfigurationGeneratorSchema = {
  project: 'test',
  skipFormat: false,
  style: 'css',
};

describe('nx-stylelint:configuration generator', () => {
  let tree: Tree;

  beforeAll(async () => {
    logger.info = jest.fn();
  });

  beforeEach(async () => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should add stylelint target, run init generator and create project .stylelinrrc.json', async () => {
    const projectStylelint = `libs/test/.stylelintrc.json`;

    await libraryGenerator(tree, { name: 'test' });
    await generator(tree, defaultOptions);

    const config = readProjectConfiguration(tree, 'test');

    expect(config).toBeDefined();
    expect(config.targets.stylelint).toBeDefined();
    expect(config.targets.stylelint.executor).toBe('nx-stylelint:lint');
    expect(config.targets.stylelint.options.config).toBe(projectStylelint);
    expect(config.targets.stylelint.options.format).toBeUndefined();
    expect(config.targets.stylelint.options.lintFilePatterns).toContain('libs/test/**/*.css');
    expect(tree.exists('.stylelintrc.json')).toBeTruthy();
    expect(tree.exists(projectStylelint)).toBeTruthy();

    const projectStylelintConfig: Partial<StylelintConfiguration> = readJson(tree, projectStylelint);
    expect(projectStylelintConfig.extends).toHaveLength(1);
    expect(projectStylelintConfig.extends).toContain('../../.stylelintrc.json');
  });

  it('should fail when project already has a stylelint target', async () => {
    logger.error = jest.fn();

    await libraryGenerator(tree, { name: 'test' });
    await generator(tree, defaultOptions);

    const config = readProjectConfiguration(tree, 'test');
    expect(config.targets.stylelint).toBeDefined();

    await generator(tree, defaultOptions);

    expect(logger.error).toHaveBeenCalledWith(`Project 'test' already has a stylelint target.`);
  });

  describe('--format', () => {
    it('should add a stylelint target with the specified formatter', async () => {
      await libraryGenerator(tree, { name: 'test' });
      await generator(tree, { ...defaultOptions, format: 'json' });

      const config = readProjectConfiguration(tree, 'test');

      expect(config).toBeDefined();
      expect(config.targets.stylelint).toBeDefined();
      expect(config.targets.stylelint.executor).toBe('nx-stylelint:lint');
      expect(config.targets.stylelint.options.format).toBe('json');
    });
  });

  describe('--style', () => {
    it('should add a a glob pattern for the specified style extension', async () => {
      await libraryGenerator(tree, { name: 'test' });
      await generator(tree, { ...defaultOptions, format: 'json', style: 'scss' });

      const config = readProjectConfiguration(tree, 'test');

      expect(config).toBeDefined();
      expect(config.targets.stylelint).toBeDefined();
      expect(config.targets.stylelint.executor).toBe('nx-stylelint:lint');
      expect(config.targets.stylelint.options.lintFilePatterns).toContain('libs/test/**/*.css');
      expect(config.targets.stylelint.options.lintFilePatterns).toContain('libs/test/**/*.scss');
    });
  });
});
