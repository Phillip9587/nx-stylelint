import { startLocalRegistry } from '@nx/js/plugins/jest/local-registry';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

export default async () => {
  const localRegistryTarget = 'nx-stylelint:local-registry';
  const storage = './tmp/local-registry/storage';

  global.stopLocalRegistry = await startLocalRegistry({
    localRegistryTarget,
    storage,
    verbose: false,
  });

  try {
    const json = JSON.parse(readFileSync(`./dist/nx-stylelint/package.json`).toString());
    json.version = '0.0.0-e2e';
    writeFileSync(`./dist/nx-stylelint/package.json`, JSON.stringify(json, null, 2));
  } catch {
    console.error(`Error reading package.json file from library build output.`);
  }
  execSync(`npm publish --access public --tag e2e`, { cwd: './dist/nx-stylelint', env: process.env, stdio: 'inherit' });
};
