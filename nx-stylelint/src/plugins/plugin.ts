import {
  CreateDependencies,
  CreateNodes,
  TargetConfiguration,
  cacheDir,
  readJsonFile,
  writeJsonFile,
} from '@nx/devkit';
import { calculateHashForCreateNodes } from '@nx/devkit/src/utils/calculate-hash-for-create-nodes';
import { existsSync } from 'node:fs';
import * as nodePath from 'node:path';
import { getInputConfigFiles } from '../utils/config-file';

export interface StylelintPluginOptions {
  targetName?: string;
  extensions?: string[];
}

const cachePath = nodePath.join(cacheDir, 'stylelint.hash');
const targetsCache = existsSync(cachePath) ? readTargetsCache() : {};

const calculatedTargets: Record<string, Record<string, TargetConfiguration>> = {};

function readTargetsCache(): Record<string, Record<string, TargetConfiguration>> {
  return readJsonFile(cachePath);
}

function writeTargetsToCache(targets: Record<string, Record<string, TargetConfiguration>>) {
  writeJsonFile(cachePath, targets);
}

export const createDependencies: CreateDependencies = () => {
  writeTargetsToCache(calculatedTargets);
  return [];
};

export const createNodes: CreateNodes<StylelintPluginOptions> = [
  '**/.stylelintrc.{json,yml,yaml,js,cjs,mjs,ts}',
  async (configFilePath, options, context) => {
    const projectRoot = nodePath.dirname(configFilePath);

    // Do not create a project if package.json and project.json isn't there.
    if (
      !existsSync(nodePath.join(context.workspaceRoot, projectRoot, 'package.json')) &&
      !existsSync(nodePath.join(context.workspaceRoot, projectRoot, 'project.json'))
    )
      return {};

    const isStandaloneWorkspace =
      projectRoot === '.' &&
      existsSync(nodePath.join(context.workspaceRoot, projectRoot, 'src')) &&
      existsSync(nodePath.join(context.workspaceRoot, projectRoot, 'package.json'));

    if (projectRoot === '.' && !isStandaloneWorkspace) return {};

    const normalizedOptions = normalizeOptions(options);
    const hash = calculateHashForCreateNodes(projectRoot, normalizedOptions, context);
    const targets = targetsCache[hash] ?? (await buildStylelintTargets(configFilePath, projectRoot, normalizedOptions));

    calculatedTargets[hash] = targets;

    return {
      projects: {
        [projectRoot]: {
          root: projectRoot,
          targets: targets,
        },
      },
    };
  },
];

async function buildStylelintTargets(
  configFilePath: string,
  projectRoot: string,
  options: Required<StylelintPluginOptions>,
): Promise<Record<string, TargetConfiguration>> {
  const inputConfigFiles = await getInputConfigFiles(configFilePath, projectRoot);

  return {
    [options.targetName]: {
      command: `stylelint`,
      cache: true,
      options: {
        cwd: projectRoot,
        args: [`"${getLintFileGlob(options.extensions)}"`],
      },
      inputs: [
        'default',
        // Certain lint rules can be impacted by changes to dependencies
        '^default',
        ...inputConfigFiles,
        { externalDependencies: ['stylelint'] },
      ],
    },
  };
}

function normalizeOptions(options: StylelintPluginOptions | undefined): Required<StylelintPluginOptions> {
  // Normalize user input for extensions (strip leading . characters)
  let extensions: string[] | undefined;
  if (Array.isArray(options?.extensions)) {
    extensions = [...new Set(options.extensions.map((f) => f.replace(/^\.+/, '')))];
  }

  return {
    targetName: options?.targetName ?? 'stylelint',
    extensions: extensions ?? ['css'],
  };
}

function getLintFileGlob(extensions: string[]): string {
  if (extensions.length === 1) return `**/*.${extensions[0]}`;
  return `**/*.{${extensions.join(',')}}`;
}
