import { joinPathFragments, offsetFromRoot, readJson, workspaceRoot, writeJson, type Tree } from '@nx/devkit';
import { cosmiconfig } from 'cosmiconfig';
import { existsSync } from 'node:fs';
import { dirname, isAbsolute, join, relative } from 'node:path';
import type { Config, Config as StylelintConfig } from 'stylelint';
import { PROJECT_STYLELINT_CONFIG_SCSS_OVERRIDE, ROOT_STYLELINT_CONFIG, ROOT_STYLELINT_CONFIG_SCSS } from './config';
import { isRelativePath } from './path';

export const STYLELINT_CONFIG_FILE_PATTERN = '.stylelintrc(.(json|yml|yaml|js))?';

export const STYLELINT_CONFIG_FILE = '.stylelintrc.json';

export const createRootStylelintConfigFile = (tree: Tree, withScssSupport: boolean) =>
  writeJson<Config>(tree, STYLELINT_CONFIG_FILE, withScssSupport ? ROOT_STYLELINT_CONFIG_SCSS : ROOT_STYLELINT_CONFIG);

export function createProjectStylelintConfigFile(tree: Tree, projectRoot: string, withScssSupport: boolean) {
  const config = {
    extends: [joinPathFragments(offsetFromRoot(projectRoot), STYLELINT_CONFIG_FILE)],
    ignoreFiles: ['!**/*'],
    overrides: [
      {
        files: ['**/*.css'],
        rules: {},
      },
    ],
  };

  if (withScssSupport) {
    config.overrides.push(PROJECT_STYLELINT_CONFIG_SCSS_OVERRIDE);
  }

  writeJson<Config>(tree, joinPathFragments(projectRoot, STYLELINT_CONFIG_FILE), config);
}

export function isCompatibleRootConfig(tree: Tree): boolean {
  if (!tree.exists(STYLELINT_CONFIG_FILE)) return false;
  const config = readJson<Config>(tree, STYLELINT_CONFIG_FILE);
  return config.ignoreFiles === '**/*' || (Array.isArray(config.ignoreFiles) && config.ignoreFiles.includes('**/*'));
}

const explorer = cosmiconfig('stylelint', { cache: false, stopDir: workspaceRoot });

export async function getInputConfigFiles(configFilePath: string, projectRoot: string): Promise<string[]> {
  return [...(await readAffectingStylelintConfigFiles(configFilePath))]
    .map((configFilePath) => {
      if (configFilePath.startsWith(workspaceRoot)) {
        configFilePath = relative(workspaceRoot, configFilePath);

        if (configFilePath.startsWith(projectRoot)) {
          configFilePath = joinPathFragments('{projectRoot}', configFilePath.substring(projectRoot.length));
        } else {
          configFilePath = joinPathFragments('{workspaceRoot}', configFilePath);
        }
      }
      return configFilePath;
    })
    .sort();
}

export async function readAffectingStylelintConfigFiles(configFilePath: string): Promise<Set<string>> {
  if (!existsSync(configFilePath)) return new Set();

  try {
    const result = await explorer.load(configFilePath);
    if (!result) return new Set();

    const stylelintConfigFiles = new Set<string>([result.filepath]);
    const stylelintConfig: StylelintConfig | null = result.config;

    if (stylelintConfig && (stylelintConfig.extends || stylelintConfig.overrides)) {
      const extendsItems = new Set<string>(
        stylelintConfig.extends ? [stylelintConfig.extends].flat().filter((v) => typeof v === 'string') : [],
      );

      if (stylelintConfig.overrides) {
        for (const override of stylelintConfig.overrides) {
          if (override.extends) {
            for (const value of [override.extends].flat().filter((v) => typeof v === 'string')) {
              extendsItems.add(value);
            }
          }
        }
      }

      if (extendsItems.size > 0) {
        const readAndAdd = async (path: string) => {
          for (const value of await readAffectingStylelintConfigFiles(path)) {
            stylelintConfigFiles.add(value);
          }
        };
        for (const extendFilePath of extendsItems) {
          if (isAbsolute(extendFilePath)) {
            await readAndAdd(extendFilePath);
          } else if (isRelativePath(extendFilePath)) {
            await readAndAdd(join(dirname(configFilePath), extendFilePath));
          }
        }
      }
    }

    return stylelintConfigFiles;
  } catch (err) {
    console.error(err);
    /* empty */
    throw err;
  }
}
