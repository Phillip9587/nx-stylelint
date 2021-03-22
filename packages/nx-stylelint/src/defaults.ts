import { TargetConfiguration } from '@nrwl/devkit';
import { Configuration as StylelintConfiguration } from 'stylelint';

/** Name of the stylelint configuration file */
export const stylelintConfigFile = '.stylelintrc.json';

// Versions
export const stylelintVersion = '^13.12.0';
export const stylelintConfigIdiomaticOrderVersion = '^8.1.0';
export const stylelintConfigPrettierVersion = '^8.0.0';
export const stylelintConfigStandardVersion = '^21.0.0';

/** Stylelint Visual Studio Code plugin identifier */
export const stylelintVSCodeExtension = 'stylelint.vscode-stylelint';
/** Visual Studio Code Extension Recommendations File Path */
export const VSCodeExtensionsFilePath = '.vscode/extensions.json';

/** Root Stylelint configuration that will be added on Init */
export const recommendedRootStylelintConfiguration: Partial<StylelintConfiguration> = {
  extends: ['stylelint-config-standard', 'stylelint-config-idiomatic-order', 'stylelint-config-prettier'],
  ignoreFiles: ['node_modules/**', 'dist/**'],
  rules: {
    'order/properties-alphabetical-order': null,
  },
};

/** Default target configuration for projects */
export const defaultTargetConfiguration: TargetConfiguration = {
  executor: 'nx-stylelint:lint',
};
