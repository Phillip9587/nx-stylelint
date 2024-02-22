import { joinPathFragments, workspaceRoot } from '@nx/devkit';
import { cosmiconfig } from 'cosmiconfig';
import { existsSync } from 'node:fs';
import { dirname, isAbsolute, join, relative } from 'node:path';
import type { Config as StylelintConfig } from 'stylelint';

export const stylelintConfigFilePattern = '.stylelintrc(.(json|yml|yaml|js))?';

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

function isRelativePath(path: string): boolean {
  return path === '.' || path === '..' || path.startsWith('./') || path.startsWith('../');
}
