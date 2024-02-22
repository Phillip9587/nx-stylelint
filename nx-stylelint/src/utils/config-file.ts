import { workspaceRoot } from '@nx/devkit';
import { cosmiconfig } from 'cosmiconfig';
import { existsSync } from 'node:fs';
import { dirname, isAbsolute, join } from 'node:path';

export const stylelintConfigFilePattern = '.stylelintrc(.(json|yml|yaml|js))?';

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

function isRelativePath(path: string): boolean {
  return path === '.' || path === '..' || path.startsWith('./') || path.startsWith('../');
}
