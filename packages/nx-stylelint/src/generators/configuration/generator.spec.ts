import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { readProjectConfiguration, readJson, logger, updateProjectConfiguration } from '@nx/devkit';
import type { Tree } from '@nx/devkit';
import { libraryGenerator } from '@nx/js';
import { formatters } from 'stylelint';
import { Config, FormatterType } from 'stylelint';
import { readFileSync } from 'fs';
import path = require('path');

import generator from './generator';
import { ConfigurationGeneratorSchema } from './schema';

const defaultOptions: ConfigurationGeneratorSchema = {
  project: 'test',
  skipFormat: false,
};

describe('nx-stylelint:configuration options', () => {
  const schemaJson = JSON.parse(readFileSync(path.join(__dirname, 'schema.json'), 'utf-8'));

  it('formatter should contain all core formatters as enum', () => {
    const formatterEnum = schemaJson.properties.formatter.enum;

    for (const formatterKey of Object.keys(formatters)) {
      expect(formatterEnum).toContain(formatterKey);
    }
  });

  it('formatter x-prompt should contain all core formatters as items', () => {
    const items = schemaJson.properties.formatter['x-prompt'].items;

    for (const formatterKey of Object.keys(formatters)) {
      expect(items).toContainEqual({
        value: formatterKey,
        label: formatterKey === 'string' ? `${formatterKey} (default)` : formatterKey,
      });
    }
  });
});

describe('nx-stylelint:configuration generator', () => {
  let tree: Tree;

  beforeAll(async () => {
    logger.info = jest.fn();
  });

  beforeEach(async () => {
    tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
  });

  it('should add stylelint target, run init generator and create project .stylelinrrc.json', async () => {
    const projectStylelint = `libs/test/.stylelintrc.json`;

    await libraryGenerator(tree, { name: 'test', compiler: 'tsc' });
    await generator(tree, defaultOptions);

    const packagejson = readJson(tree, 'package.json');
    expect(packagejson.devDependencies['stylelint']).toBe('^15.0.0');
    expect(packagejson.devDependencies['stylelint-config-standard']).toBe('^34.0.0');
    expect(packagejson.devDependencies['stylelint-config-standard-scss']).toBeUndefined();

    const config = readProjectConfiguration(tree, 'test');
    expect(config.targets?.['stylelint']).toStrictEqual({
      executor: 'nx-stylelint:lint',
      outputs: ['{options.outputFile}'],
      options: {
        lintFilePatterns: ['libs/test/**/*.css'],
      },
    });

    expect(tree.exists('.stylelintrc.json')).toBeTruthy();
    expect(tree.exists(projectStylelint)).toBeTruthy();

    const projectStylelintConfig = readJson<Config>(tree, projectStylelint);
    expect(projectStylelintConfig).toStrictEqual({
      extends: ['../../.stylelintrc.json'],
      ignoreFiles: ['!**/*'],
      overrides: [
        {
          files: ['**/*.css'],
          rules: {},
        },
      ],
    });
  });

  it('should add stylelint target alongside other targets, run init generator and create project .stylelinrrc.json', async () => {
    const projectStylelint = `libs/test/.stylelintrc.json`;

    await libraryGenerator(tree, { name: 'test', compiler: 'tsc' });

    let config = readProjectConfiguration(tree, 'test');
    config.targets = {
      package: {
        executor: '@nrwl/node:package',
      },
    };
    updateProjectConfiguration(tree, 'test', config);

    await generator(tree, defaultOptions);

    config = readProjectConfiguration(tree, 'test');

    expect(config).toBeDefined();
    expect(config.targets?.['package']).toBeDefined();
    expect(config.targets?.['package'].executor).toBe('@nrwl/node:package');
    expect(config.targets?.['stylelint']).toBeDefined();
    expect(config.targets?.['stylelint'].executor).toBe('nx-stylelint:lint');
    expect(config.targets?.['stylelint'].options.format).toBeUndefined();
    expect(config.targets?.['stylelint'].options.lintFilePatterns).toContain('libs/test/**/*.css');
    expect(tree.exists('.stylelintrc.json')).toBeTruthy();
    expect(tree.exists(projectStylelint)).toBeTruthy();

    const projectStylelintConfig = readJson<Config>(tree, projectStylelint);
    expect(projectStylelintConfig.extends).toHaveLength(1);
    expect(projectStylelintConfig.extends).toContain('../../.stylelintrc.json');
  });

  it('should fail when project already has a stylelint target', async () => {
    logger.error = jest.fn();

    await libraryGenerator(tree, { name: 'test', compiler: 'tsc' });
    await generator(tree, defaultOptions);

    const config = readProjectConfiguration(tree, 'test');
    expect(config.targets?.['stylelint']).toBeDefined();

    await generator(tree, defaultOptions);

    expect(logger.error).toHaveBeenCalledWith(`Project 'test' already has a stylelint target.`);
  });

  describe('--formatter', () => {
    it('should add a stylelint target with the specified formatter', async () => {
      await libraryGenerator(tree, { name: 'test', compiler: 'tsc' });
      await generator(tree, { ...defaultOptions, formatter: 'json' });

      const config = readProjectConfiguration(tree, 'test');
      expect(config.targets?.['stylelint']).toStrictEqual({
        executor: 'nx-stylelint:lint',
        outputs: ['{options.outputFile}'],
        options: {
          formatter: 'json',
          lintFilePatterns: ['libs/test/**/*.css'],
        },
      });
    });

    it('should print a error if the format is not defined', async () => {
      logger.error = jest.fn();
      await libraryGenerator(tree, { name: 'test', compiler: 'tsc' });
      await generator(tree, { ...defaultOptions, formatter: 'test' as unknown as FormatterType });

      const config = readProjectConfiguration(tree, 'test');

      expect(config).toBeDefined();
      expect(config.targets?.['stylelint']).toBeDefined();
      expect(config.targets?.['stylelint'].executor).toBe('nx-stylelint:lint');
      expect(config.targets?.['stylelint'].options.formatter).toBeUndefined();
      expect(logger.error).toHaveBeenCalledWith(
        `Given formatter 'test' is not a stylelint core formatter. Falling back to 'string' formatter.`
      );
    });
  });

  describe('--scss', () => {
    it('should add stylelint target, run init generator and create project .stylelinrrc.json with SCSS support', async () => {
      const projectStylelint = `libs/test/.stylelintrc.json`;

      await libraryGenerator(tree, { name: 'test', compiler: 'tsc' });
      await generator(tree, { ...defaultOptions, scss: true });

      const packagejson = readJson(tree, 'package.json');
      expect(packagejson.devDependencies['stylelint']).toBe('^15.0.0');
      expect(packagejson.devDependencies['stylelint-config-standard']).toBe('^34.0.0');
      expect(packagejson.devDependencies['stylelint-config-standard-scss']).toBe('^11.0.0');

      const config = readProjectConfiguration(tree, 'test');
      expect(config.targets?.['stylelint']).toStrictEqual({
        executor: 'nx-stylelint:lint',
        outputs: ['{options.outputFile}'],
        options: {
          lintFilePatterns: ['libs/test/**/*.css', 'libs/test/**/*.scss'],
        },
      });

      expect(tree.exists('.stylelintrc.json')).toBeTruthy();
      expect(tree.exists(projectStylelint)).toBeTruthy();

      const projectStylelintConfig = readJson<Config>(tree, projectStylelint);
      expect(projectStylelintConfig).toStrictEqual({
        extends: ['../../.stylelintrc.json'],
        ignoreFiles: ['!**/*'],
        overrides: [
          {
            files: ['**/*.css'],
            rules: {},
          },
          {
            files: ['**/*.scss'],
            rules: {},
          },
        ],
      });
    });
  });
});
