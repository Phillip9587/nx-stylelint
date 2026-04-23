module.exports = {
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
