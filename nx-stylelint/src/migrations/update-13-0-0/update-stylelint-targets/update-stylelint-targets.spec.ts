import { addProjectConfiguration, readProjectConfiguration } from '@nx/devkit';
import type { Tree, ProjectConfiguration } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import updateStylelintTargets from './update-stylelint-targets';

describe('update-stylelint-targets', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();

    addProjectConfiguration(tree, 'proj', {
      root: 'libs/proj',
      targets: {
        target1: {
          executor: 'nx-stylelint:lint',
          options: {
            config: 'libs/proj/.stylelintrc.json',
            format: 'json',
          },
        },
        target2: {
          executor: 'nx-stylelint:lint',
          outputs: ['dist'],
          options: {
            config: 'libs/proj/configs/.stylelintrc.json',
            format: 'string',
          },
        },
        target3: {
          executor: 'nx-stylelint:lint',
          outputs: ['{options.outputFile}'],
          options: {},
        },
        notStylelint: {
          executor: '@nrwl/node:build',
          options: {},
        },
      },
    });
  });

  it('should update targets', async () => {
    await updateStylelintTargets(tree);

    expect(readProjectConfiguration(tree, 'proj')).toStrictEqual<ProjectConfiguration & { $schema: string }>({
      $schema: '../../node_modules/nx/schemas/project-schema.json',
      name: 'proj',
      root: 'libs/proj',
      targets: {
        target1: {
          executor: 'nx-stylelint:lint',
          options: {
            formatter: 'json',
          },
          outputs: ['{options.outputFile}'],
        },
        target2: {
          executor: 'nx-stylelint:lint',
          options: {
            config: 'libs/proj/configs/.stylelintrc.json',
            formatter: 'string',
          },
          outputs: ['dist', '{options.outputFile}'],
        },
        target3: {
          executor: 'nx-stylelint:lint',
          options: {},
          outputs: ['{options.outputFile}'],
        },
        notStylelint: {
          executor: '@nrwl/node:build',
          options: {},
        },
      },
    });
  });
});
