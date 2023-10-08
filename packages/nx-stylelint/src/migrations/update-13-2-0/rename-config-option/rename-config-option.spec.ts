import { addProjectConfiguration, readProjectConfiguration } from '@nx/devkit';
import type { ProjectConfiguration } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
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

    expect(readProjectConfiguration(tree, 'proj')).toStrictEqual<ProjectConfiguration & { $schema: string }>({
      $schema: '../../node_modules/nx/schemas/project-schema.json',
      name: 'proj',
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
