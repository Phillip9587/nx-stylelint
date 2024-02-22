import { CreateNodes, joinPathFragments, workspaceRoot } from '@nx/devkit';
import { existsSync } from 'node:fs';
import * as nodePath from 'node:path';
import { readAffectingStylelintConfigFiles } from '../utils/config-file';

export interface StylelintPluginOptions {
  targetName?: string;
  lintFilePatterns?: string | string[];
}

export const createNodes: CreateNodes<StylelintPluginOptions> = [
  '**/.stylelintrc.{json,yml,yaml,js,cjs,mjs}',
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

async function getInputConfigFiles(configFilePath: string, projectRoot: string): Promise<string[]> {
  return [...(await readAffectingStylelintConfigFiles(configFilePath))]
    .filter((p) => p.startsWith(workspaceRoot))
    .map((configFilePath) => {
      if (configFilePath.startsWith(workspaceRoot)) {
        configFilePath = nodePath.relative(workspaceRoot, configFilePath);

        if (configFilePath.startsWith(projectRoot)) {
          configFilePath = joinPathFragments('{projectRoot}', configFilePath.substring(projectRoot.length));
        } else {
          configFilePath = joinPathFragments('{workspaceRoot}', configFilePath);
        }
      }

      return configFilePath;
    });
}

function normalizeOptions(options: StylelintPluginOptions | undefined) {
  return {
    targetName: options?.targetName ?? 'stylelint',
    lintFilePatterns: options?.lintFilePatterns ? [options?.lintFilePatterns].flat() : ['**/*.css'],
  };
}
