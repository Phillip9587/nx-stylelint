import {
  CreateNodesV2,
  ProjectConfiguration,
  TargetConfiguration,
  createNodesFromFiles,
  getPackageManagerCommand,
  readJsonFile,
  writeJsonFile,
  hashArray,
  CreateNodesContextV2,
} from '@nx/devkit';
import { calculateHashForCreateNodes } from '@nx/devkit/src/utils/calculate-hash-for-create-nodes.js';
import { existsSync, readdirSync } from 'node:fs';
import * as nodePath from 'node:path';
import { getInputConfigFiles } from '../utils/config-file.js';
import { workspaceDataDirectory } from '../utils/workspace-data-directory.js';

const pmc = getPackageManagerCommand();

const STYLELINT_CONFIG_FILES = [
  '.stylelintrc',
  '.stylelintrc.json',
  '.stylelintrc.yml',
  '.stylelintrc.yaml',
  '.stylelintrc.js',
  '.stylelintrc.cjs',
  '.stylelintrc.mjs',
  '.stylelintrc.ts',
  '.stylelintrc.cts',
  '.stylelintrc.mts',
  'stylelint.config.js',
  'stylelint.config.cjs',
  'stylelint.config.mjs',
  'stylelint.config.ts',
  'stylelint.config.cts',
  'stylelint.config.mts',
];

const STYLELINT_CONFIG_FILES_GLOB = `{${STYLELINT_CONFIG_FILES.map((f) => `**/${f}`).join(',')}}`;

export interface StylelintPluginOptions {
  targetName?: string;
  extensions?: string[];
}

function readTargetsCache(cachePath: string): Record<string, TargetConfiguration> {
  return existsSync(cachePath) ? readJsonFile(cachePath) : {};
}

function writeTargetsToCache(cachePath: string, results: Record<string, TargetConfiguration>) {
  writeJsonFile(cachePath, results);
}

export const createNodes: CreateNodesV2<StylelintPluginOptions> = [
  STYLELINT_CONFIG_FILES_GLOB,
  async (projectConfigurationFiles, options, context) => {
    const normalizedOptions = normalizeOptions(options);
    const optionsHash = hashArray(Object.entries(normalizedOptions).map(([key, value]) => key + JSON.stringify(value)));
    const cachePath = nodePath.join(workspaceDataDirectory, `stylelint-${optionsHash}.hash`);
    const targetsCache = readTargetsCache(cachePath);

    try {
      return await createNodesFromFiles(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        (configFile, options, context) => createNodesInternal(configFile, options!, context, targetsCache),
        projectConfigurationFiles,
        normalizedOptions,
        context,
      );
    } finally {
      writeTargetsToCache(cachePath, targetsCache);
    }
  },
];

export const createNodesV2 = createNodes;

async function createNodesInternal(
  configFilePath: string,
  options: Required<StylelintPluginOptions>,
  context: CreateNodesContextV2,
  targetsCache: Record<string, TargetConfiguration>,
) {
  const projectRoot = nodePath.dirname(configFilePath);

  // Do not create a project if package.json and project.json isn't there.
  const siblingFiles = readdirSync(nodePath.join(context.workspaceRoot, projectRoot));
  if (!siblingFiles.includes('package.json') && !siblingFiles.includes('project.json')) {
    return {};
  }

  const isStandaloneWorkspace =
    projectRoot === '.' &&
    existsSync(nodePath.join(context.workspaceRoot, projectRoot, 'src')) &&
    existsSync(nodePath.join(context.workspaceRoot, projectRoot, 'package.json'));
  if (projectRoot === '.' && !isStandaloneWorkspace) return {};

  const hash = await calculateHashForCreateNodes(projectRoot, options, context);

  targetsCache[hash] ??= await stylelintTarget(configFilePath, projectRoot, options);
  const target = targetsCache[hash];

  const project: ProjectConfiguration = {
    root: projectRoot,
    targets: {
      [options.targetName]: target,
    },
  };

  return {
    projects: {
      [projectRoot]: project,
    },
  };
}

async function stylelintTarget(
  configFilePath: string,
  projectRoot: string,
  options: Required<StylelintPluginOptions>,
): Promise<TargetConfiguration> {
  const inputConfigFiles = await getInputConfigFiles(configFilePath, projectRoot);

  const glob =
    options.extensions.length === 1 ? `**/*.${options.extensions[0]}` : `**/*.{${options.extensions.join(',')}}`;

  return {
    command: `stylelint "${glob}"`,
    cache: true,
    options: {
      cwd: projectRoot,
    },
    inputs: [
      `{projectRoot}/**/*.(${options.extensions.join('|')})`,
      ...inputConfigFiles,
      { externalDependencies: ['stylelint'] },
    ],
    metadata: {
      technologies: ['stylelint'],
      description: 'Runs Stylelint on project',
      help: {
        command: `${pmc.exec} stylelint --help`,
        example: {},
      },
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
