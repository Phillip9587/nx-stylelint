/* eslint-disable */
import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  displayName: 'nx-stylelint',
  preset: '../jest.preset.js',
  globals: {},
  transform: {
    '^.+\\.[tj]s$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
  moduleFileExtensions: ['ts', 'js'],
  coverageDirectory: '../coverage/nx-stylelint',
  testEnvironment: 'node',
};

export default config;
