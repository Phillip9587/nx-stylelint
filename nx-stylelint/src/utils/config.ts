import type { Config } from 'stylelint';

type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[]
  ? ElementType
  : never;

type ConfigOverride = ArrayElement<NonNullable<Config['overrides']>>;

export const ROOT_STYLELINT_CONFIG = {
  ignoreFiles: ['**/*'],
  overrides: [
    {
      files: ['**/*.css'],
      extends: ['stylelint-config-standard'],
      rules: {},
    },
  ],
  rules: {},
} satisfies Config;

export const ROOT_STYLELINT_CONFIG_SCSS_OVERRIDE: ConfigOverride = {
  files: ['**/*.scss'],
  extends: ['stylelint-config-standard-scss'],
  rules: {},
};

export const ROOT_STYLELINT_CONFIG_SCSS = {
  ...ROOT_STYLELINT_CONFIG,
  overrides: [...ROOT_STYLELINT_CONFIG.overrides, ROOT_STYLELINT_CONFIG_SCSS_OVERRIDE],
} satisfies Config;

export const PROJECT_STYLELINT_CONFIG_SCSS_OVERRIDE = {
  files: ['**/*.scss'],
  rules: {},
} satisfies ConfigOverride;
