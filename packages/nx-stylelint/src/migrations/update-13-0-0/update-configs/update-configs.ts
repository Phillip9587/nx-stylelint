/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { formatFiles, getProjects, logger, updateJson } from '@nx/devkit';
import type { Tree } from '@nx/devkit';
import type { Config } from 'stylelint';

export default async function updateConfigs(host: Tree): Promise<void> {
  updateRootStylelintConfig(host);
  updateProjectStylelintConfigs(host);

  logger.warn(
    `Migrated your .stylelintrc.json files. Please carefully review the changes and update your configs according to the stylelint migration guide at https://stylelint.io/migration-guide/to-14.`
  );

  await formatFiles(host);
}

function updateRootStylelintConfig(host: Tree): void {
  if (!host.exists('.stylelintrc.json')) return;

  updateJson<Config, Config>(host, '.stylelintrc.json', (json) => {
    json.ignoreFiles = ['**/*'];

    json.overrides ??= [];
    json.overrides.unshift({
      files: ['**/*.scss'],
      extends: getExtendsWithoutDuplicates(json, 'stylelint-config-standard-scss', ['stylelint-config-standard']),
      rules: {},
    });
    json.overrides.unshift({
      files: ['**/*.css'],
      extends: getExtendsWithoutDuplicates(json, 'stylelint-config-standard', []),
      rules: {},
    });

    delete json.extends;
    return json;
  });
}

function getExtendsWithoutDuplicates(config: Config, addInFront: string, blacklistedConfigs: string[]): string[] {
  let values = ensureStringArray(config.extends).slice();

  blacklistedConfigs = [...blacklistedConfigs, 'stylelint-config-prettier'];

  values.unshift(addInFront);

  values = values.filter((v) => !blacklistedConfigs.includes(v));
  values = Array.from(new Set(values));
  values.push('stylelint-config-prettier');

  return values;
}

function updateProjectStylelintConfigs(host: Tree): void {
  for (const [, project] of getProjects(host)) {
    if (!project.targets) {
      continue;
    }

    for (const target of Object.values(project.targets).filter((t) => t.executor === 'nx-stylelint:lint')) {
      const configFilePath = target.options.config;
      if (configFilePath && host.exists(configFilePath)) {
        updateJson<Config, Config>(host, configFilePath, (json) => {
          json.ignoreFiles = ensureStringArray(json.ignoreFiles);
          json.ignoreFiles.unshift('!**/*');

          json.overrides ??= [];
          json.overrides.unshift({
            files: ['**/*.scss'],
            rules: {},
          });
          json.overrides.unshift({
            files: ['**/*.css'],
            rules: {},
          });

          return json;
        });
      }
    }
  }
}

function ensureStringArray(value: string | string[] | undefined): string[] {
  if (typeof value === 'string') {
    return [value];
  }
  return value ?? [];
}
