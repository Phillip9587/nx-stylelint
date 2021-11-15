import { addProjectConfiguration, readJson, writeJson, logger } from '@nrwl/devkit';
import type { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import updateConfigs from './update-configs';
import type { Config } from 'stylelint';

describe('addOutputs', () => {
  let tree: Tree;

  beforeEach(() => {
    logger.warn = jest.fn();

    tree = createTreeWithEmptyWorkspace();

    writeJson(tree, '.stylelintrc.json', {
      extends: [
        'stylelint-config-standard',
        'stylelint-config-sass-guidelines',
        'stylelint-config-idiomatic-order',
        'stylelint-config-prettier',
      ],
      ignoreFiles: ['node_modules/**', 'dist/**'],
      rules: {
        'max-nesting-depth': 2,
        'no-invalid-position-at-import-rule': null,
      },
    });

    writeJson(tree, 'proj/.stylelintrc.json', {
      extends: ['../.stylelintrc.json'],
    });

    addProjectConfiguration(tree, 'proj', {
      root: 'proj',
      targets: {
        stylelint: {
          executor: 'nx-stylelint:lint',
          options: {
            config: 'proj/.stylelintrc.json',
            lintFilePatterns: ['proj/**/*.css', 'proj/**/*.scss'],
          },
        },
      },
    });
  });

  it('should migrate configs', async () => {
    await updateConfigs(tree);

    expect(readJson(tree, '.stylelintrc.json')).toStrictEqual<Config>({
      ignoreFiles: ['**/*'],
      overrides: [
        {
          files: ['**/*.css'],
          extends: [
            'stylelint-config-standard',
            'stylelint-config-sass-guidelines',
            'stylelint-config-idiomatic-order',
            'stylelint-config-prettier',
          ],
          rules: {},
        },
        {
          files: ['**/*.scss'],
          extends: [
            'stylelint-config-standard-scss',
            'stylelint-config-sass-guidelines',
            'stylelint-config-idiomatic-order',
            'stylelint-config-prettier',
          ],
          rules: {},
        },
      ],
      rules: {
        'max-nesting-depth': 2,
        'no-invalid-position-at-import-rule': null,
      },
    });

    expect(readJson(tree, 'proj/.stylelintrc.json')).toStrictEqual<Config>({
      extends: ['../.stylelintrc.json'],
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
