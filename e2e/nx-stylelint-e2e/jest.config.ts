import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  displayName: 'nx-stylelint-e2e',
  preset: '../../jest.preset.ts',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+/.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/e2e/nx-stylelint-e2e',
  testEnvironment: 'node',
};

export default config;
