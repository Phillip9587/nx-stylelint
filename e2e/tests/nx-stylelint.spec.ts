import { NxJsonConfiguration, ProjectConfiguration, TargetConfiguration, writeJsonFile } from '@nx/devkit';
import { checkFilesExist, readJson, runNxCommand, uniq } from '@nx/plugin/testing';
import { execSync } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import type { Config } from 'stylelint';

describe('nx-stylelint e2e', () => {
  let projectDirectory: string;

  beforeAll(() => {
    projectDirectory = createTestProject();

    execSync(`npm install --save-dev nx-stylelint@e2e`, {
      cwd: projectDirectory,
      stdio: 'inherit',
      env: process.env,
    });
  });

  afterAll(() => rmSync(projectDirectory, { recursive: true, force: true }));

  it('should be installed', () => {
    // npm ls will fail if the package is not installed properly
    execSync('npm ls nx-stylelint', { cwd: projectDirectory, stdio: 'inherit' });
  });

  it('nx-stylelint:init', () => {
    runNxCommand('generate nx-stylelint:init');

    expect(() => checkFilesExist('.stylelintrc.json', 'package.json', 'nx.json')).not.toThrow();

    const packageJson = readJson('package.json');
    expect(packageJson.devDependencies['nx-stylelint']).toBeTruthy();
    expect(packageJson.devDependencies.stylelint).toBeTruthy();
    expect(packageJson.devDependencies['stylelint-config-standard']).toBeTruthy();
    expect(packageJson.devDependencies['stylelint-config-standard-scss']).toBeUndefined();

    expect(readJson<Config>('.stylelintrc.json')).toStrictEqual<Config>({
      ignoreFiles: ['**/*'],
      overrides: [
        {
          files: ['**/*.css'],
          extends: ['stylelint-config-standard'],
          rules: {},
        },
      ],
      rules: {},
    });

    const nxJson = readJson<NxJsonConfiguration>('nx.json');
    expect(nxJson.targetDefaults.stylelint).toStrictEqual({
      inputs: ['default', '{workspaceRoot}/.stylelintrc(.(json|yml|yaml|js))?'],
      cache: true,
    });
  });

  describe('nx-stylelint:configuration', () => {
    it('should add a stylelint configuration to a project', () => {
      const projectName = uniq('lib-');
      const project2Name = uniq('lib-');

      writeJsonFile(join(projectDirectory, '.stylelintrc.json'), {
        ignoreFiles: ['**/*'],
        overrides: [
          {
            files: ['**/*.css'],
            extends: ['stylelint-config-standard'],
            rules: {},
          },
        ],
        rules: {},
      });

      runNxCommand(`generate @nx/js:library --name ${projectName}`);
      runNxCommand(`generate nx-stylelint:configuration --project ${projectName}`);

      expect(() =>
        checkFilesExist('.stylelintrc.json', 'package.json', 'nx.json', `${projectName}/.stylelintrc.json`),
      ).not.toThrow();

      let packageJson = readJson('package.json');
      expect(packageJson.devDependencies['nx-stylelint']).toBeTruthy();
      expect(packageJson.devDependencies.stylelint).toBeTruthy();
      expect(packageJson.devDependencies['stylelint-config-standard']).toBeTruthy();
      expect(packageJson.devDependencies['stylelint-config-standard-scss']).toBeUndefined();

      let rootConfig = readJson<Config>('.stylelintrc.json');
      expect(rootConfig).toStrictEqual<Config>({
        ignoreFiles: ['**/*'],
        overrides: [
          {
            files: ['**/*.css'],
            extends: ['stylelint-config-standard'],
            rules: {},
          },
        ],
        rules: {},
      });

      let projectConfig = readJson<Config>(`${projectName}/.stylelintrc.json`);
      expect(projectConfig).toStrictEqual<Config>({
        extends: ['../.stylelintrc.json'],
        ignoreFiles: ['!**/*'],
        overrides: [
          {
            files: ['**/*.css'],
            rules: {},
          },
        ],
      });

      let projectJson = readJson<ProjectConfiguration>(`${projectName}/project.json`);
      expect(projectJson.targets.stylelint).toStrictEqual<TargetConfiguration>({
        executor: 'nx-stylelint:lint',
        options: {
          lintFilePatterns: [`${projectName}/**/*.css`],
        },
        outputs: ['{options.outputFile}'],
      });

      runNxCommand(`generate @nx/js:library --name ${project2Name}`);
      runNxCommand(`generate nx-stylelint:configuration --project ${project2Name} --scss true`);

      packageJson = readJson('package.json');
      expect(packageJson.devDependencies['nx-stylelint']).toBeTruthy();
      expect(packageJson.devDependencies.stylelint).toBeTruthy();
      expect(packageJson.devDependencies['stylelint-config-standard']).toBeTruthy();
      expect(packageJson.devDependencies['stylelint-config-standard-scss']).toBeTruthy();

      rootConfig = readJson<Config>('.stylelintrc.json');
      expect(rootConfig).toStrictEqual<Config>({
        ignoreFiles: ['**/*'],
        overrides: [
          {
            files: ['**/*.css'],
            extends: ['stylelint-config-standard'],
            rules: {},
          },
          {
            files: ['**/*.scss'],
            extends: ['stylelint-config-standard-scss'],
            rules: {},
          },
        ],
        rules: {},
      });

      projectConfig = readJson<Config>(`${project2Name}/.stylelintrc.json`);
      expect(projectConfig).toStrictEqual<Config>({
        extends: ['../.stylelintrc.json'],
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

      projectJson = readJson<ProjectConfiguration>(`${project2Name}/project.json`);
      expect(projectJson.targets.stylelint).toStrictEqual<TargetConfiguration>({
        executor: 'nx-stylelint:lint',
        options: {
          lintFilePatterns: [`${project2Name}/**/*.css`, `${project2Name}/**/*.scss`],
        },
        outputs: ['{options.outputFile}'],
      });

      execSync('npm uninstall stylelint-config-standard-scss', {
        cwd: projectDirectory,
        stdio: 'inherit',
        env: process.env,
      });

      writeJsonFile(join(projectDirectory, '.stylelintrc.json'), {
        ignoreFiles: ['**/*'],
        overrides: [
          {
            files: ['**/*.css'],
            extends: ['stylelint-config-standard'],
            rules: {},
          },
        ],
        rules: {},
      });
    });

    it('should add a stylelint configuration to a project and set the specified formatter', () => {
      const projectName = uniq('lib-');

      runNxCommand(`generate @nx/js:library --name ${projectName}`);
      runNxCommand(`generate nx-stylelint:configuration --project ${projectName} --formatter json`);

      expect(() =>
        checkFilesExist('.stylelintrc.json', 'package.json', 'nx.json', `${projectName}/.stylelintrc.json`),
      ).not.toThrow();

      expect(readJson<Config>(`${projectName}/.stylelintrc.json`)).toStrictEqual<Config>({
        extends: ['../.stylelintrc.json'],
        ignoreFiles: ['!**/*'],
        overrides: [
          {
            files: ['**/*.css'],
            rules: {},
          },
        ],
      });

      expect(
        readJson<ProjectConfiguration>(`${projectName}/project.json`).targets.stylelint,
      ).toStrictEqual<TargetConfiguration>({
        executor: 'nx-stylelint:lint',
        options: {
          formatter: 'json',
          lintFilePatterns: [`${projectName}/**/*.css`],
        },
        outputs: ['{options.outputFile}'],
      });
    });
  });
});

/**
 * Creates a test project with create-nx-workspace and installs the plugin
 * @returns The directory where the test project was created
 */
function createTestProject() {
  const projectName = 'proj';
  const projectDirectory = join(process.cwd(), 'tmp', 'nx-e2e', projectName);

  rmSync(projectDirectory, {
    recursive: true,
    force: true,
  });
  mkdirSync(dirname(projectDirectory), {
    recursive: true,
  });

  execSync(`npx --yes create-nx-workspace@latest ${projectName} --preset apps --no-nxCloud --no-interactive`, {
    cwd: dirname(projectDirectory),
    stdio: 'inherit',
    env: process.env,
  });

  return projectDirectory;
}
