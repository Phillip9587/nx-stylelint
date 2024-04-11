import { CreateNodes } from '@nx/devkit';
import { existsSync } from 'node:fs';
import * as nodePath from 'node:path';
import { getInputConfigFiles } from '../utils/config-file';

export interface StylelintPluginOptions {
  targetName?: string;
  lintFilePatterns?: string | string[];
}

export const createNodes: CreateNodes<StylelintPluginOptions> = [
  '**/.stylelintrc.{json,yml,yaml,js,cjs,mjs,ts}',
  async (configFilePath, options, context) => {
    const { targetName, lintFilePatterns } = normalizeOptions(options);

    const projectRoot = nodePath.dirname(configFilePath);

    // Do not create a project if package.json and project.json isn't there.
    if (
      !existsSync(nodePath.join(context.workspaceRoot, projectRoot, 'package.json')) &&
      !existsSync(nodePath.join(context.workspaceRoot, projectRoot, 'project.json'))
    )
      return {};

    const inputConfigFiles = await getInputConfigFiles(configFilePath, projectRoot);

    return {
      projects: {
        [projectRoot]: {
          targets: {
            [targetName]: {
              command: `stylelint`,
              cache: true,
              options: {
                cwd: projectRoot,
                args: [...lintFilePatterns.map((pattern) => `"${pattern}"`)],
              },
              inputs: ['default', ...inputConfigFiles, { externalDependencies: ['stylelint'] }],
            },
          },
        },
      },
    };
  },
];

function normalizeOptions(options: StylelintPluginOptions | undefined) {
  return {
    targetName: options?.targetName ?? 'stylelint',
    lintFilePatterns: options?.lintFilePatterns ? [options?.lintFilePatterns].flat() : ['**/*.css'],
  };
}
