import { type Tree, joinPathFragments, offsetFromRoot, readJson, writeJson } from '@nx/devkit';
import type { Config } from 'stylelint';
import { PROJECT_STYLELINT_CONFIG_SCSS_OVERRIDE, ROOT_STYLELINT_CONFIG, ROOT_STYLELINT_CONFIG_SCSS } from './config';
import { workspaceRoot } from '@nx/devkit';
import { cosmiconfig } from 'cosmiconfig';
import { existsSync } from 'node:fs';
import { dirname, isAbsolute, join } from 'node:path';
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

export async function readAffectingStylelintConfigFiles(filePath: string): Promise<Set<string>> {
  if (!existsSync(filePath)) return new Set();

  try {
    const result = await explorer.load(filePath);
    if (!result) return new Set();

    const stylelintConfigFiles = new Set<string>([result.filepath]);

    if (result.config?.['extends']) {
      const extendsItems = new Set<string>();
      if (typeof result.config?.['extends'] === 'string') {
        extendsItems.add(result.config['extends']);
      } else if (Array.isArray(result.config?.['extends'])) {
        for (const value of result.config['extends'].filter((v) => typeof v === 'string')) {
          extendsItems.add(value);
        }
      }

      if (extendsItems.size > 0) {
        for (const extendFilePath of extendsItems) {
          if (isAbsolute(extendFilePath)) {
            for (const value of await readAffectingStylelintConfigFiles(extendFilePath)) {
              stylelintConfigFiles.add(value);
            }
          } else if (isRelativePath(extendFilePath)) {
            const path = join(dirname(filePath), extendFilePath);
            for (const value of await readAffectingStylelintConfigFiles(path)) {
              stylelintConfigFiles.add(value);
            }
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
