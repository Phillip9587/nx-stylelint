/**
 * Copied from https://github.com/nrwl/nx/blob/b73f1e0e0002c55fc0bacaa1557140adb9eec8de/packages/nx/src/utils/cache-directory.ts
 *
 * TODO: Delete when workspaceDataDirectory gets exported from @nx/devkit
 */

import { workspaceRoot } from '@nx/devkit';
import { existsSync } from 'node:fs';
import { isAbsolute, join } from 'node:path';

function absolutePath(root: string, path: string): string {
  if (isAbsolute(path)) {
    return path;
  } else {
    return join(root, path);
  }
}

function pickCacheDirectory(root: string, nonNxCacheDirectory: string, nxCacheDirectory: string) {
  // If nx.json doesn't exist the repo can't utilize
  // caching, so .nx/cache is less relevant. Lerna users
  // that don't want to fully opt in to Nx at this time
  // may also be caught off guard by the appearance of
  // a .nx directory, so we are going to special case
  // this for the time being.
  if (existsSync(join(root, 'lerna.json')) && !existsSync(join(root, 'nx.json'))) {
    return join(root, 'node_modules', '.cache', nonNxCacheDirectory);
  }
  return join(root, '.nx', nxCacheDirectory);
}

function defaultWorkspaceDataDirectory(root: string) {
  return pickCacheDirectory(root, 'nx-workspace-data', 'workspace-data');
}

export const workspaceDataDirectory = workspaceDataDirectoryForWorkspace(workspaceRoot);

function workspaceDataDirectoryForWorkspace(workspaceRoot: string) {
  return absolutePath(
    workspaceRoot,
    process.env['NX_WORKSPACE_DATA_DIRECTORY'] ??
      process.env['NX_PROJECT_GRAPH_CACHE_DIRECTORY'] ??
      defaultWorkspaceDataDirectory(workspaceRoot)
  );
}
