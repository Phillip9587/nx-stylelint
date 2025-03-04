import type { Config } from 'jest';

const config: Config = {
  displayName: 'e2e',
  preset: '../jest.preset.js',
  globals: {},
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../coverage/e2e',
  testEnvironment: 'node',
  globalSetup: './start-local-registry.ts',
  globalTeardown: './stop-local-registry.ts',
};

export default config;
