import { formatFiles, readWorkspaceConfiguration, updateWorkspaceConfiguration } from '@nx/devkit';
import type { Tree } from '@nx/devkit';
import { stylelintConfigFilePattern } from '../../utils/config-file';

export default async function (tree: Tree) {
  // If the workspace doesn't have a nx.json, don't make any changesF
  if (!tree.exists('nx.json')) return;

  const workspaceConfiguration = readWorkspaceConfiguration(tree);

  // Remove .stylelintrc.json from deprecated implicitDependencies
  if (
    workspaceConfiguration.implicitDependencies &&
    '.stylelintrc.json' in workspaceConfiguration.implicitDependencies
  ) {
    delete workspaceConfiguration.implicitDependencies['.stylelintrc.json'];
  }

  // remove stylelint config files from production inputs
  const stylelintProjectConfigFilePattern = `!{projectRoot}/${stylelintConfigFilePattern}`;
  if (
    workspaceConfiguration.namedInputs?.['production'] &&
    !workspaceConfiguration.namedInputs?.['production'].includes(stylelintProjectConfigFilePattern)
  ) {
    workspaceConfiguration.namedInputs?.['production'].push(stylelintProjectConfigFilePattern);
  }

  // Set targetDefault for stylelint
  workspaceConfiguration.targetDefaults ??= {};
  workspaceConfiguration.targetDefaults['stylelint'] ??= {};
  workspaceConfiguration.targetDefaults['stylelint'].inputs ??= [
    'default',
    `{workspaceRoot}/${stylelintConfigFilePattern}`,
  ];

  updateWorkspaceConfiguration(tree, workspaceConfiguration);

  await formatFiles(tree);
}
