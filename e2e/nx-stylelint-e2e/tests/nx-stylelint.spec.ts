import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  updateFile,
  cleanup,
  uniq,
} from '@nrwl/nx-plugin/testing';
import type { NxJsonConfiguration, WorkspaceJsonConfiguration } from '@nrwl/devkit';

describe('nx-stylelint e2e', () => {
  describe('nx-stylelint:init', () => {
    beforeAll(() => {
      cleanup();
    });

    beforeEach(() => {
      ensureNxProject('nx-stylelint', 'dist/packages/nx-stylelint');
    });

    it('should initialize nx-stylelint', async () => {
      await runNxCommandAsync(`generate nx-stylelint:init`);

      expect(() => checkFilesExist('.stylelintrc.json', 'package.json', 'workspace.json', 'nx.json')).not.toThrow();

      const packageJson = readJson('package.json');

      expect(packageJson.devDependencies['nx-stylelint']);
      expect(packageJson.devDependencies.stylelint).toBeTruthy();
      expect(packageJson.devDependencies['stylelint-config-idiomatic-order']).toBeTruthy();
      expect(packageJson.devDependencies['stylelint-config-prettier']).toBeTruthy();
      expect(packageJson.devDependencies['stylelint-config-standard']).toBeTruthy();

      const stylelintRc = readJson('.stylelintrc.json');
      expect(stylelintRc).toMatchObject({
        extends: ['stylelint-config-standard', 'stylelint-config-idiomatic-order', 'stylelint-config-prettier'],
        ignoreFiles: ['node_modules/**', 'dist/**'],
        rules: {
          'order/properties-alphabetical-order': null,
        },
      });

      const nxJson: NxJsonConfiguration = readJson('nx.json');
      expect(nxJson.tasksRunnerOptions.default).toBeTruthy();
      expect(nxJson.tasksRunnerOptions.default.options.cacheableOperations).toContain('stylelint');
      expect(nxJson.implicitDependencies['.stylelintrc.json']).toBe('*');
    }, 90000);

    it('should not update .stylelintrc.json if present', async () => {
      updateFile(
        '.stylelintrc.json',
        JSON.stringify({ extends: ['stylelint-config-standarf'], ignoreFile: ['node_modules/**'], rules: {} })
      );

      await runNxCommandAsync(`generate nx-stylelint:init`);

      expect(() => checkFilesExist('.stylelintrc.json', 'package.json', 'workspace.json', 'nx.json')).not.toThrow();

      const packageJson = readJson('package.json');

      expect(packageJson.devDependencies['nx-stylelint']);
      expect(packageJson.devDependencies.stylelint).toBeTruthy();
      expect(packageJson.devDependencies['stylelint-config-idiomatic-order']).toBeFalsy();
      expect(packageJson.devDependencies['stylelint-config-prettier']).toBeFalsy();
      expect(packageJson.devDependencies['stylelint-config-standard']).toBeFalsy();

      const stylelintRc = readJson('.stylelintrc.json');
      expect(stylelintRc).toMatchObject({
        extends: ['stylelint-config-standarf'],
        ignoreFile: ['node_modules/**'],
        rules: {},
      });

      const nxJson: NxJsonConfiguration = readJson('nx.json');
      expect(nxJson.tasksRunnerOptions.default).toBeTruthy();
      expect(nxJson.tasksRunnerOptions.default.options.cacheableOperations).toContain('stylelint');
      expect(nxJson.implicitDependencies['.stylelintrc.json']).toBe('*');
    }, 90000);
  });

  describe('nx-stylelint:configuration', () => {
    beforeAll(() => {
      cleanup();
    });

    beforeEach(() => {
      ensureNxProject('nx-stylelint', 'dist/packages/nx-stylelint');
    });

    it('should add a stylelint configuration to a project', async () => {
      const projName = uniq('nx-stylelint');
      await runNxCommandAsync(`generate @nrwl/workspace:library --name ${projName}`);
      await runNxCommandAsync(`generate nx-stylelint:configuration --project ${projName}`);

      expect(() =>
        checkFilesExist(
          '.stylelintrc.json',
          'package.json',
          'workspace.json',
          'nx.json',
          `libs/${projName}/.stylelintrc.json`
        )
      ).not.toThrow();

      const packageJson = readJson('package.json');

      expect(packageJson.devDependencies['nx-stylelint']);
      expect(packageJson.devDependencies.stylelint).toBeTruthy();
      expect(packageJson.devDependencies['stylelint-config-idiomatic-order']).toBeTruthy();
      expect(packageJson.devDependencies['stylelint-config-prettier']).toBeTruthy();
      expect(packageJson.devDependencies['stylelint-config-standard']).toBeTruthy();

      const stylelintRc = readJson('.stylelintrc.json');
      expect(stylelintRc).toMatchObject({
        extends: ['stylelint-config-standard', 'stylelint-config-idiomatic-order', 'stylelint-config-prettier'],
        ignoreFiles: ['node_modules/**', 'dist/**'],
        rules: {
          'order/properties-alphabetical-order': null,
        },
      });

      const projectStylelintRc = readJson(`libs/${projName}/.stylelintrc.json`);
      expect(projectStylelintRc).toMatchObject({
        extends: ['../../.stylelintrc.json'],
      });

      const nxJson: NxJsonConfiguration = readJson('nx.json');
      expect(nxJson.tasksRunnerOptions.default).toBeTruthy();
      expect(nxJson.tasksRunnerOptions.default.options.cacheableOperations).toContain('stylelint');
      expect(nxJson.implicitDependencies['.stylelintrc.json']).toBe('*');

      const workspaceJson: WorkspaceJsonConfiguration = readJson('workspace.json');

      expect(workspaceJson.projects[projName].targets.stylelint).toMatchObject({
        executor: 'nx-stylelint:lint',
        options: {
          config: `libs/${projName}/.stylelintrc.json`,
          lintFilePatterns: [`libs/${projName}/**/*.css`],
        },
      });
    }, 90000);

    describe('--format', () => {
      it('should add a stylelint configuration to a project and set the specified formatter', async () => {
        const projName = uniq('nx-stylelint');
        await runNxCommandAsync(`generate @nrwl/workspace:library --name ${projName}`);
        await runNxCommandAsync(`generate nx-stylelint:configuration --project ${projName} --format json`);

        expect(() =>
          checkFilesExist(
            '.stylelintrc.json',
            'package.json',
            'workspace.json',
            'nx.json',
            `libs/${projName}/.stylelintrc.json`
          )
        ).not.toThrow();

        const packageJson = readJson('package.json');

        expect(packageJson.devDependencies['nx-stylelint']);
        expect(packageJson.devDependencies.stylelint).toBeTruthy();
        expect(packageJson.devDependencies['stylelint-config-idiomatic-order']).toBeTruthy();
        expect(packageJson.devDependencies['stylelint-config-prettier']).toBeTruthy();
        expect(packageJson.devDependencies['stylelint-config-standard']).toBeTruthy();

        const stylelintRc = readJson('.stylelintrc.json');
        expect(stylelintRc).toMatchObject({
          extends: ['stylelint-config-standard', 'stylelint-config-idiomatic-order', 'stylelint-config-prettier'],
          ignoreFiles: ['node_modules/**', 'dist/**'],
          rules: {
            'order/properties-alphabetical-order': null,
          },
        });

        const projectStylelintRc = readJson(`libs/${projName}/.stylelintrc.json`);
        expect(projectStylelintRc).toMatchObject({
          extends: ['../../.stylelintrc.json'],
        });

        const nxJson: NxJsonConfiguration = readJson('nx.json');
        expect(nxJson.tasksRunnerOptions.default).toBeTruthy();
        expect(nxJson.tasksRunnerOptions.default.options.cacheableOperations).toContain('stylelint');
        expect(nxJson.implicitDependencies['.stylelintrc.json']).toBe('*');

        const workspaceJson: WorkspaceJsonConfiguration = readJson('workspace.json');

        expect(workspaceJson.projects[projName].targets.stylelint).toMatchObject({
          executor: 'nx-stylelint:lint',
          options: {
            config: `libs/${projName}/.stylelintrc.json`,
            lintFilePatterns: [`libs/${projName}/**/*.css`],
            format: 'json',
          },
        });
      }, 90000);
    });

    describe('--style', () => {
      it('should add a stylelint configuration to a project and add the styleExtension to the lintFilePatterns', async () => {
        const projName = uniq('nx-stylelint');
        await runNxCommandAsync(`generate @nrwl/workspace:library --name ${projName}`);
        await runNxCommandAsync(`generate nx-stylelint:configuration --project ${projName} --style scss`);

        expect(() =>
          checkFilesExist(
            '.stylelintrc.json',
            'package.json',
            'workspace.json',
            'nx.json',
            `libs/${projName}/.stylelintrc.json`
          )
        ).not.toThrow();

        const packageJson = readJson('package.json');

        expect(packageJson.devDependencies['nx-stylelint']);
        expect(packageJson.devDependencies.stylelint).toBeTruthy();
        expect(packageJson.devDependencies['stylelint-config-idiomatic-order']).toBeTruthy();
        expect(packageJson.devDependencies['stylelint-config-prettier']).toBeTruthy();
        expect(packageJson.devDependencies['stylelint-config-standard']).toBeTruthy();

        const stylelintRc = readJson('.stylelintrc.json');
        expect(stylelintRc).toMatchObject({
          extends: ['stylelint-config-standard', 'stylelint-config-idiomatic-order', 'stylelint-config-prettier'],
          ignoreFiles: ['node_modules/**', 'dist/**'],
          rules: {
            'order/properties-alphabetical-order': null,
          },
        });

        const projectStylelintRc = readJson(`libs/${projName}/.stylelintrc.json`);
        expect(projectStylelintRc).toMatchObject({
          extends: ['../../.stylelintrc.json'],
        });

        const nxJson: NxJsonConfiguration = readJson('nx.json');
        expect(nxJson.tasksRunnerOptions.default).toBeTruthy();
        expect(nxJson.tasksRunnerOptions.default.options.cacheableOperations).toContain('stylelint');
        expect(nxJson.implicitDependencies['.stylelintrc.json']).toBe('*');

        const workspaceJson: WorkspaceJsonConfiguration = readJson('workspace.json');

        expect(workspaceJson.projects[projName].targets.stylelint).toMatchObject({
          executor: 'nx-stylelint:lint',
          options: {
            config: `libs/${projName}/.stylelintrc.json`,
            lintFilePatterns: [`libs/${projName}/**/*.css`, `libs/${projName}/**/*.scss`],
          },
        });
      }, 90000);
    });
  });
});
