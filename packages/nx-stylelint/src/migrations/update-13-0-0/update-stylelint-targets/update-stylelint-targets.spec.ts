import { addProjectConfiguration, readProjectConfiguration } from '@nrwl/devkit';
import type { Tree, ProjectConfiguration } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import updateStylelintTargets from './update-stylelint-targets';

describe('update-stylelint-targets', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();

    addProjectConfiguration(tree, 'proj', {
      root: 'proj',
      targets: {
        target1: {
          executor: 'nx-stylelint:lint',
          options: {
            format: 'json',
          },
        },
        target2: {
          executor: 'nx-stylelint:lint',
          outputs: ['dist'],
          options: {
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

    expect(readProjectConfiguration(tree, 'proj')).toStrictEqual<ProjectConfiguration>({
      root: 'proj',
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
