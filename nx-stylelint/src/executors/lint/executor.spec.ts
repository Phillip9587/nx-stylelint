import type { LintExecutorSchema } from './schema';
import * as fs from 'node:fs';
import type { ExecutorContext } from '@nx/devkit';
import type { LinterResult } from 'stylelint';
import { logger } from '@nx/devkit';
import { normalize } from 'node:path';
import executor from './executor';

jest.mock('node:fs', () => ({
  ...jest.requireActual('node:fs'),
  existsSync: jest.fn(),
  writeFileSync: jest.fn(),
}));

let mockResult: LinterResult;
let mockLint: jest.Mock;

jest.mock('../../utils/stylelint', () => ({
  __esModule: true,
  loadStylelintLint: jest.fn(async () => mockLint),
}));

const defaultOptions: LintExecutorSchema = {
  allowEmptyInput: true,
  lintFilePatterns: ['styles.scss'],
  formatter: 'string',
  silent: false,
  force: false,
  fix: false,
  reportNeedlessDisables: true,
  ignoreDisables: false,
  reportDescriptionlessDisables: false,
  reportInvalidScopeDisables: false,
  quiet: false,
  cache: false,
};

const defaultMockResult: LinterResult = {
  cwd: '',
  reportedDisables: [],
  errored: false,
  report: 'Report',
  results: [],
  ruleMetadata: {},
};

const mockResultWithWarnings: LinterResult = {
  ...defaultMockResult,
  results: [
    {
      warnings: [
        { column: 0, line: 0, rule: 'test', severity: 'warning', text: '' },
        { column: 0, line: 0, rule: 'test', severity: 'warning', text: '' },
        { column: 0, line: 0, rule: 'test', severity: 'warning', text: '' },
      ],
      errored: false,
      deprecations: [],
      ignored: false,
      invalidOptionWarnings: [],
      source: '',
      parseErrors: [],
    },
  ],
};

const mockResultWithErrors: LinterResult = {
  ...defaultMockResult,
  errored: true,
  results: [
    {
      warnings: [
        { column: 0, line: 0, rule: 'test', severity: 'error', text: '' },
        { column: 0, line: 0, rule: 'test', severity: 'error', text: '' },
      ],
      errored: true,
      deprecations: [],
      ignored: false,
      invalidOptionWarnings: [],
      source: '',
      parseErrors: [],
    },
  ],
};

const mockResultWithErrorsAndWarnings: LinterResult = {
  ...defaultMockResult,
  errored: true,
  results: [
    {
      warnings: [
        { column: 0, line: 0, rule: 'test', severity: 'error', text: '' },
        { column: 0, line: 0, rule: 'test', severity: 'warning', text: '' },
        { column: 0, line: 0, rule: 'test', severity: 'warning', text: '' },
      ],
      errored: true,
      deprecations: [],
      ignored: false,
      invalidOptionWarnings: [],
      source: '',
      parseErrors: [],
    },
  ],
};

/*
TODO: Fix Jest ESM Problems :-(

describe('nx-stylelint:lint options', () => {
  const schemaJson = JSON.parse(fs.readFileSync(join(__dirname, 'schema.json'), 'utf-8'));

  it('formatter should contain all core formatters as enum', async () => {
    const formatterEnum = schemaJson.properties.formatter.anyOf[0].enum;
    const formatters = await import('stylelint').then((m) => Object.keys(m.formatters));

    for (const formatterKey of formatters) {
      expect(formatterEnum).toContain(formatterKey);
    }
  });
});
*/

describe('nx-stylelint:lint executor', () => {
  const projectName = 'proj';
  const mockContext: ExecutorContext = {
    projectName: undefined,
    root: '/root',
    cwd: '/root',
    isVerbose: false,
    projectGraph: {
      nodes: {
        [projectName]: {
          type: 'app',
          name: projectName,
          data: {
            root: `apps/${projectName}`,
            sourceRoot: `apps/${projectName}/src`,
            targets: {},
          },
        },
      },
      dependencies: {
        [projectName]: [],
      },
    },
    projectsConfigurations: {
      version: 2,
      projects: {
        [projectName]: {
          root: `apps/${projectName}`,
          sourceRoot: `apps/${projectName}/src`,
          targets: {},
        },
      },
    },
    nxJsonConfiguration: {},
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(process, 'chdir').mockImplementation();
    jest.mocked(fs.existsSync).mockImplementation((path) => (path === '.stylelintrc.json' ? true : false));
    logger.warn = jest.fn();
    logger.error = jest.fn();
    logger.info = jest.fn();

    console.warn = jest.fn();

    mockResult = defaultMockResult;
    mockLint = jest.fn().mockImplementation(() => mockResult);
  });

  it('should succeed', async () => {
    const { success } = await executor(defaultOptions, mockContext);
    expect(success).toBeTruthy();
    expect(logger.info).toHaveBeenCalledWith('\nAll files pass linting.');
  });

  it('should not log if the silent flag was passed', async () => {
    const { success } = await executor({ ...defaultOptions, silent: true }, mockContext);

    expect(success).toBeTruthy();
    expect(logger.info).not.toHaveBeenCalled();
    expect(logger.error).not.toHaveBeenCalled();
    expect(logger.warn).not.toHaveBeenCalled();
  });

  it('should not log if the silent flag was passed and errors', async () => {
    mockResult = mockResultWithErrorsAndWarnings;

    const { success } = await executor({ ...defaultOptions, silent: true }, mockContext);

    expect(success).toBeFalsy();
    expect(logger.info).not.toHaveBeenCalled();
    expect(logger.error).not.toHaveBeenCalled();
    expect(logger.warn).not.toHaveBeenCalled();
  });

  it('should log if there are no warnings or errors', async () => {
    const { success } = await executor(defaultOptions, mockContext);

    expect(success).toBeTruthy();
    expect(logger.info).toHaveBeenCalledWith('\nLinting Styles "<???>"...');
    expect(logger.error).not.toHaveBeenCalledWith('\nLint errors found in the listed files.');
    expect(logger.warn).not.toHaveBeenCalledWith('\nLint warnings found in the listed files.');
    expect(logger.info).toHaveBeenCalledWith('\nAll files pass linting.');
  });

  it('should log when there are warnings', async () => {
    mockResult = mockResultWithWarnings;

    const { success } = await executor(defaultOptions, mockContext);

    expect(success).toBeTruthy();
    expect(logger.info).toHaveBeenCalledWith('\nLinting Styles "<???>"...');
    expect(logger.error).not.toHaveBeenCalledWith('\nLint errors found in the listed files.');
    expect(logger.warn).toHaveBeenCalledWith('\nLint warnings found in the listed files.');
    expect(logger.info).not.toHaveBeenCalledWith('\nAll files pass linting.');
  });

  it('should log when there are errors and warnings', async () => {
    mockResult = mockResultWithErrorsAndWarnings;

    const { success } = await executor(defaultOptions, mockContext);

    expect(success).toBeFalsy();
    expect(logger.info).toHaveBeenCalledWith('\nLinting Styles "<???>"...');
    expect(logger.error).toHaveBeenCalledWith('\nLint errors found in the listed files.');
    expect(logger.warn).toHaveBeenCalledWith('\nLint warnings found in the listed files.');
    expect(logger.info).not.toHaveBeenCalledWith('\nAll files pass linting.');
  });

  it('should fail when maxWarnings exceeded', async () => {
    mockResult = mockResultWithWarnings;
    mockResult.maxWarningsExceeded = {
      foundWarnings: 14,
      maxWarnings: 10,
    };

    const { success } = await executor({ ...defaultOptions, maxWarnings: 2 }, mockContext);

    expect(success).toBeFalsy();
    expect(logger.info).toHaveBeenCalledWith('\nLinting Styles "<???>"...');
    expect(logger.error).not.toHaveBeenCalledWith('\nLint errors found in the listed files.');
    expect(logger.warn).toHaveBeenCalledWith('\nLint warnings found in the listed files.');
    expect(logger.info).not.toHaveBeenCalledWith('\nAll files pass linting.');
  });

  it('should log when there are errors', async () => {
    mockResult = mockResultWithErrors;

    const { success } = await executor(defaultOptions, mockContext);

    expect(success).toBeFalsy();
    expect(logger.info).toHaveBeenCalledWith('\nLinting Styles "<???>"...');
    expect(logger.error).toHaveBeenCalledWith('\nLint errors found in the listed files.');
    expect(logger.warn).not.toHaveBeenCalledWith('\nLint warnings found in the listed files.');
    expect(logger.info).not.toHaveBeenCalledWith('\nAll files pass linting.');
  });

  it('should attempt to write the lint results to the output file, if specified', async () => {
    mockResult = mockResultWithErrors;

    const { success } = await executor(
      {
        ...defaultOptions,
        outputFile: 'output.json',
      },
      mockContext,
    );

    expect(success).toBeFalsy();
    expect(logger.error).toHaveBeenCalledWith('\nLint errors found in the listed files.');
    expect(jest.mocked(fs.writeFileSync)).toHaveBeenCalledWith(normalize('/root/output.json'), 'Report');
  });

  it('should not attempt to write the lint results to the output file, if not specified', async () => {
    const { success } = await executor(defaultOptions, mockContext);

    expect(success).toBeTruthy();
    expect(jest.mocked(fs.writeFileSync)).not.toHaveBeenCalled();
  });
});
