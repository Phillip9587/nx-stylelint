import { checkFilesExist, ensureNxProject, readJson, runNxCommandAsync, cleanup, uniq } from '@nrwl/nx-plugin/testing';
import { NxJsonConfiguration, ProjectConfiguration, TargetConfiguration } from '@nrwl/devkit';
import type { Config } from 'stylelint';

describe('nx-stylelint-e2e', () => {
  beforeAll(() => {
    cleanup();
  });

  beforeEach(() => {
    ensureNxProject('nx-stylelint', 'dist/packages/nx-stylelint');
  });

  describe('nx-stylelint:init', () => {
    it('should initialize nx-stylelint', async () => {
      await runNxCommandAsync(`generate nx-stylelint:init`);

      expect(() => checkFilesExist('.stylelintrc.json', 'package.json', 'nx.json')).not.toThrow();

      const packageJson = readJson('package.json');

      expect(packageJson.devDependencies['nx-stylelint']).toBeTruthy();
      expect(packageJson.devDependencies.stylelint).toBeTruthy();
      expect(packageJson.devDependencies['stylelint-config-prettier']).toBeTruthy();
      expect(packageJson.devDependencies['stylelint-config-standard']).toBeTruthy();

      const stylelintRc = readJson<Config>('.stylelintrc.json');
      expect(stylelintRc).toStrictEqual<Config>({
        ignoreFiles: ['**/*'],
        overrides: [
          {
            files: ['**/*.css'],
            extends: ['stylelint-config-standard', 'stylelint-config-prettier'],
            rules: {},
          },
        ],
        rules: {},
      });

      const nxJson: NxJsonConfiguration = readJson('nx.json');

      expect(nxJson.tasksRunnerOptions.default).toBeTruthy();
      expect(nxJson.tasksRunnerOptions.default.options.cacheableOperations).toContain('stylelint');

      expect(nxJson.targetDefaults.stylelint).toStrictEqual({
        inputs: ['default', '{workspaceRoot}/.stylelintrc(.(json|yml|yaml|js))?'],
      });
    }, 120000);
  });

  describe('nx-stylelint:configuration', () => {
    it('should add a stylelint configuration to a project', async () => {
      const projName = uniq('nx-stylelint');
      await runNxCommandAsync(`generate @nrwl/js:library --name ${projName}`);
      await runNxCommandAsync(`generate nx-stylelint:configuration --project ${projName}`);

      expect(() =>
        checkFilesExist('.stylelintrc.json', 'package.json', 'nx.json', `libs/${projName}/.stylelintrc.json`)
      ).not.toThrow();

      const packageJson = readJson('package.json');

      expect(packageJson.devDependencies['nx-stylelint']).toBeTruthy();
      expect(packageJson.devDependencies.stylelint).toBeTruthy();
      expect(packageJson.devDependencies['stylelint-config-prettier']).toBeTruthy();
      expect(packageJson.devDependencies['stylelint-config-standard']).toBeTruthy();
      expect(packageJson.devDependencies['stylelint-config-standard-scss']).toBeUndefined();

      const rootConfig = readJson<Config>('.stylelintrc.json');
      expect(rootConfig).toStrictEqual<Config>({
        ignoreFiles: ['**/*'],
        overrides: [
          {
            files: ['**/*.css'],
            extends: ['stylelint-config-standard', 'stylelint-config-prettier'],
            rules: {},
          },
        ],
        rules: {},
      });

      const projectConfig = readJson<Config>(`libs/${projName}/.stylelintrc.json`);
      expect(projectConfig).toStrictEqual<Config>({
        extends: ['../../.stylelintrc.json'],
        ignoreFiles: ['!**/*'],
        overrides: [
          {
            files: ['**/*.css'],
            rules: {},
          },
        ],
      });

      const nxJson: NxJsonConfiguration = readJson('nx.json');

      expect(nxJson.tasksRunnerOptions.default).toBeTruthy();
      expect(nxJson.tasksRunnerOptions.default.options.cacheableOperations).toContain('stylelint');

      expect(nxJson.targetDefaults.stylelint).toStrictEqual({
        inputs: ['default', '{workspaceRoot}/.stylelintrc(.(json|yml|yaml|js))?'],
      });

      const projectJson = readJson<ProjectConfiguration>(`libs/${projName}/project.json`);

      expect(projectJson.targets.stylelint).toStrictEqual<TargetConfiguration>({
        executor: 'nx-stylelint:lint',
        options: {
          lintFilePatterns: [`libs/${projName}/**/*.css`],
        },
        outputs: ['{options.outputFile}'],
      });
    }, 120000);

    describe('--formatter', () => {
      it('should add a stylelint configuration to a project and set the specified formatter', async () => {
        const projName = uniq('nx-stylelint');
        await runNxCommandAsync(`generate @nrwl/js:library --name ${projName}`);
        await runNxCommandAsync(`generate nx-stylelint:configuration --project ${projName} --formatter json`);

        expect(() =>
          checkFilesExist('.stylelintrc.json', 'package.json', 'nx.json', `libs/${projName}/.stylelintrc.json`)
        ).not.toThrow();

        const packageJson = readJson('package.json');

        expect(packageJson.devDependencies['nx-stylelint']).toBeTruthy();
        expect(packageJson.devDependencies.stylelint).toBeTruthy();
        expect(packageJson.devDependencies['stylelint-config-prettier']).toBeTruthy();
        expect(packageJson.devDependencies['stylelint-config-standard']).toBeTruthy();
        expect(packageJson.devDependencies['stylelint-config-standard-scss']).toBeUndefined();

        const rootConfig = readJson<Config>('.stylelintrc.json');
        expect(rootConfig).toStrictEqual({
          ignoreFiles: ['**/*'],
          overrides: [
            {
              files: ['**/*.css'],
              extends: ['stylelint-config-standard', 'stylelint-config-prettier'],
              rules: {},
            },
          ],
          rules: {},
        });

        const projectConfig = readJson<Config>(`libs/${projName}/.stylelintrc.json`);
        expect(projectConfig).toStrictEqual<Config>({
          extends: ['../../.stylelintrc.json'],
          ignoreFiles: ['!**/*'],
          overrides: [
            {
              files: ['**/*.css'],
              rules: {},
            },
          ],
        });

        const nxJson: NxJsonConfiguration = readJson('nx.json');

        expect(nxJson.tasksRunnerOptions.default).toBeTruthy();
        expect(nxJson.tasksRunnerOptions.default.options.cacheableOperations).toContain('stylelint');

        expect(nxJson.targetDefaults.stylelint).toStrictEqual({
          inputs: ['default', '{workspaceRoot}/.stylelintrc(.(json|yml|yaml|js))?'],
        });

        const projectJson = readJson<ProjectConfiguration>(`libs/${projName}/project.json`);

        expect(projectJson.targets.stylelint).toStrictEqual<TargetConfiguration>({
          executor: 'nx-stylelint:lint',
          options: {
            lintFilePatterns: [`libs/${projName}/**/*.css`],
            formatter: 'json',
          },
          outputs: ['{options.outputFile}'],
        });
      }, 120000);
    });
  });

  describe('nx-stylelint:scss', () => {
    it('should add scss support to a target and configuration', async () => {
      const projName = uniq('nx-stylelint');
      await runNxCommandAsync(`generate @nrwl/js:library --name ${projName}`);
      await runNxCommandAsync(`generate nx-stylelint:configuration --project ${projName}`);
      await runNxCommandAsync(`generate nx-stylelint:scss --project ${projName}`);

      expect(() =>
        checkFilesExist('.stylelintrc.json', 'package.json', 'nx.json', `libs/${projName}/.stylelintrc.json`)
      ).not.toThrow();

      const packageJson = readJson('package.json');

      expect(packageJson.devDependencies['nx-stylelint']).toBeTruthy();
      expect(packageJson.devDependencies.stylelint).toBeTruthy();
      expect(packageJson.devDependencies['stylelint-config-prettier']).toBeTruthy();
      expect(packageJson.devDependencies['stylelint-config-standard']).toBeTruthy();
      expect(packageJson.devDependencies['stylelint-config-standard-scss']).toBeTruthy();

      const rootConfig = readJson<Config>('.stylelintrc.json');
      expect(rootConfig).toStrictEqual<Config>({
        ignoreFiles: ['**/*'],
        overrides: [
          {
            files: ['**/*.css'],
            extends: ['stylelint-config-standard', 'stylelint-config-prettier'],
            rules: {},
          },
          {
            files: ['**/*.scss'],
            extends: ['stylelint-config-standard-scss', 'stylelint-config-prettier'],
            rules: {},
          },
        ],
        rules: {},
      });

      const projectConfig = readJson<Config>(`libs/${projName}/.stylelintrc.json`);
      expect(projectConfig).toStrictEqual<Config>({
        extends: ['../../.stylelintrc.json'],
        ignoreFiles: ['!**/*'],
        overrides: [
          {
            files: ['**/*.css'],
            rules: {},
          },
          {
            files: ['**/*.scss'],
            rules: {},
          },
        ],
      });

      const nxJson: NxJsonConfiguration = readJson('nx.json');

      expect(nxJson.tasksRunnerOptions.default).toBeTruthy();
      expect(nxJson.tasksRunnerOptions.default.options.cacheableOperations).toContain('stylelint');

      expect(nxJson.targetDefaults.stylelint).toStrictEqual({
        inputs: ['default', '{workspaceRoot}/.stylelintrc(.(json|yml|yaml|js))?'],
      });

      const projectJson: ProjectConfiguration = readJson(`libs/${projName}/project.json`);

      expect(projectJson.targets.stylelint).toStrictEqual<TargetConfiguration>({
        executor: 'nx-stylelint:lint',
        options: {
          lintFilePatterns: [`libs/${projName}/**/*.css`, `libs/${projName}/**/*.scss`],
        },
        outputs: ['{options.outputFile}'],
      });
    }, 150000);
  });
});
