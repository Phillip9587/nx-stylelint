import type { LintExecutorSchema } from './schema';
import * as fs from 'fs';
import type { ExecutorContext } from '@nx/devkit';
import { formatters } from 'stylelint';
import type { LinterResult } from 'stylelint';
import { logger } from '@nx/devkit';
import { normalize } from 'path';
import executor from './executor';
import path = require('path');

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
  output: 'Output',
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

describe('nx-stylelint:lint options', () => {
  const schemaJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'schema.json'), 'utf-8'));

  it('formatter should contain all core formatters as enum', () => {
    const formatterEnum = schemaJson.properties.formatter.anyOf[0].enum;

    for (const formatterKey of Object.keys(formatters)) {
      expect(formatterEnum).toContain(formatterKey);
    }
  });
});

describe('nx-stylelint:lint executor', () => {
  const mockContext: ExecutorContext = {
    projectName: undefined,
    root: '/root',
    cwd: '/root',
    workspace: {
      npmScope: '',
      version: 2,
      projects: {},
    },
    isVerbose: false,
  };

  let mockResult: LinterResult;

  const mockLint = jest.fn().mockImplementation(() => mockResult);

  jest.mock('stylelint', (): Partial<typeof import('stylelint')> => {
    return {
      lint: mockLint,
    };
  });

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.spyOn(process, 'chdir').mockImplementation();
    jest.spyOn(fs, 'existsSync').mockImplementation((path) => (path === '.stylelintrc.json' ? true : false));
    logger.warn = jest.fn();
    logger.error = jest.fn();
    logger.info = jest.fn();

    mockResult = defaultMockResult;
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
    jest.spyOn(fs, 'mkdirSync').mockImplementation();
    const spy = jest.spyOn(fs, 'writeFileSync').mockImplementation();

    mockResult = mockResultWithErrors;

    const { success } = await executor(
      {
        ...defaultOptions,
        outputFile: 'output.json',
      },
      mockContext
    );

    expect(success).toBeFalsy();
    expect(logger.error).toHaveBeenCalledWith('\nLint errors found in the listed files.');
    expect(spy).toHaveBeenCalledWith(normalize('/root/output.json'), 'Output');
  });

  it('should not attempt to write the lint results to the output file, if not specified', async () => {
    const spy = jest.spyOn(fs, 'writeFileSync').mockImplementation();
    const { success } = await executor(defaultOptions, mockContext);

    expect(success).toBeTruthy();
    expect(spy).not.toHaveBeenCalled();
  });
});
