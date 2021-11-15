import type { Config, ConfigOverride } from 'stylelint';

// Versions
export const stylelintVersion = '^14.0.0';
export const stylelintConfigPrettierVersion = '^8.0.0';
export const stylelintConfigStandardVersion = '^23.0.0';
export const stylelintConfigStandardScssVersion = '^2.0.0';

/** Stylelint Visual Studio Code plugin identifier */
export const stylelintVSCodeExtension = 'stylelint.vscode-stylelint';

export const recommendedScssOverrideConfiguration: ConfigOverride = {
  files: ['*.scss'],
  extends: ['stylelint-config-standard-scss', 'stylelint-config-prettier'],
  rules: {},
};

/** Root Stylelint configuration that will be added on Init */
export const recommendedRootStylelintConfiguration: Config = {
  ignoreFiles: ['**/*'],
  overrides: [
    {
      files: ['*.css'],
      extends: ['stylelint-config-standard', 'stylelint-config-prettier'],
      rules: {},
    },
  ],
  rules: {},
};
