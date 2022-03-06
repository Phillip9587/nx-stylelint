import { execSync } from 'child_process';
import * as minimatch from 'minimatch';

export const TEN_MEGABYTES = 1024 * 10000;

export function getFilesToFormat(format: string[]) {
  return [...getUncommittedFiles(format), ...getUntrackedFiles(format)];
}

function getUncommittedFiles(format: string[]): string[] {
  return parseGitOutput(`git diff --name-only --relative HEAD .`, format);
}

function getUntrackedFiles(format: string[]): string[] {
  return parseGitOutput(`git ls-files --others --exclude-standard`, format);
}

function parseGitOutput(command: string, format: string[]): string[] {
  const files = execSync(command, { maxBuffer: TEN_MEGABYTES })
    .toString('utf-8')
    .split('\n')
    .map((a) => a.trim())
    .filter((a) => a.length > 0);

  return format.map((pattern) => minimatch.match(files, pattern, { matchBase: true })).flat();
}
