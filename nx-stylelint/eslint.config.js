const baseConfig = require('../eslint.config.js');

module.exports = [
  ...baseConfig,
  {
    files: ['./package.json', './generators.json', './executors.json', './migrations.json'],
    rules: {
      '@nx/nx-plugin-checks': 'error',
      '@nx/dependency-checks': [
        'error',
        { ignoredDependencies: ['stylelint-config-standard', 'stylelint-config-standard-scss'] },
      ],
    },
    languageOptions: { parser: require('jsonc-eslint-parser') },
  },
];
