import { addProjectConfiguration, readProjectConfiguration } from '@nrwl/devkit';
import type { ProjectConfiguration } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import renameConfigOption from './rename-config-option';

describe('update-stylelint-targets', () => {
  it('should update targets', async () => {
    const tree = createTreeWithEmptyWorkspace();

    addProjectConfiguration(tree, 'proj', {
      root: 'libs/proj',
      targets: {
        target1: {
          executor: 'nx-stylelint:lint',
          options: {
            config: 'libs/proj/.stylelintrc.json',
            formatter: 'json',
          },
        },
        target2: {
          executor: 'nx-stylelint:lint',
          options: {},
        },
        notStylelint: {
          executor: '@nrwl/node:build',
          options: {},
        },
      },
    });

    await renameConfigOption(tree);

    expect(readProjectConfiguration(tree, 'proj')).toStrictEqual<ProjectConfiguration>({
      root: 'libs/proj',
      targets: {
        target1: {
          executor: 'nx-stylelint:lint',
          options: {
            configFile: 'libs/proj/.stylelintrc.json',
            formatter: 'json',
          },
        },
        target2: {
          executor: 'nx-stylelint:lint',
          options: {},
        },
        notStylelint: {
          executor: '@nrwl/node:build',
          options: {},
        },
      },
    });
  });
});
