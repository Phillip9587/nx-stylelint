import { readJsonFile } from '@nrwl/devkit';
import path = require('path');

const migrationsFile = readJsonFile<{ generators: Record<string, { implementation: string }> }>(
  require.resolve(path.join(__dirname, 'migrations.json'))
);

describe('Linter migrations', () => {
  it('should have valid paths', () => {
    Object.values(migrationsFile.generators).forEach((m) => {
      expect(() => require.resolve(path.join(__dirname, `${m.implementation}.ts`))).not.toThrow();
    });
  });
});
