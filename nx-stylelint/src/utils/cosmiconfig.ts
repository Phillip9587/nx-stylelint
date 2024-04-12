import { workspaceRoot } from '@nx/devkit';
import { cosmiconfig } from 'cosmiconfig';

const explorer = cosmiconfig('stylelint', { cache: false, stopDir: workspaceRoot });

export const loadStylelintConfig = (filepath: string) => explorer.load(filepath);
