/* eslint-disable */
import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  displayName: 'nx-stylelint',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]s?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js'],
  coverageDirectory: '../../coverage/packages/nx-stylelint',
  testEnvironment: 'node',
};

export default config;
