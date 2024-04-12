import { type Tree, joinPathFragments, offsetFromRoot, readJson, writeJson } from '@nx/devkit';
import type { Config } from 'stylelint';
import { PROJECT_STYLELINT_CONFIG_SCSS_OVERRIDE, ROOT_STYLELINT_CONFIG, ROOT_STYLELINT_CONFIG_SCSS } from './config';

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
