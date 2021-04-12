import { LintExecutorSchema } from './schema';
import * as fs from 'fs';
import { ExecutorContext } from '@nrwl/devkit';
import { LinterResult } from 'stylelint';
import { logger } from '@nrwl/devkit';
import { normalize } from 'path';
import { stylelintConfigFile } from '../../defaults';
import executor from './executor';

const defaultOptions: LintExecutorSchema = {
  config: stylelintConfigFile,
  lintFilePatterns: ['styles.scss'],
  format: 'string',
  silent: false,
  force: false,
  fix: false,
  maxWarnings: -1,
};

const defaultMockResult: LinterResult = {
  errored: false,
  output: 'Output',
  results: [],
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
    },
  ],
};

describe('nx-stylelint:lint executor', () => {
  const mockContext: ExecutorContext = {
    projectName: undefined,
    root: '/root',
    cwd: '/root',
    workspace: {
      version: 2,
      projects: {},
    },
    isVerbose: false,
  };

  let mockResult: LinterResult;

  const mockLint = jest.fn().mockImplementation(() => mockResult);

  jest.mock('stylelint', () => {
    return {
      lint: mockLint,
    };
  });

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.spyOn(process, 'chdir').mockImplementation();
    logger.warn = jest.fn();
    logger.error = jest.fn();
    logger.info = jest.fn();

    mockResult = defaultMockResult;
  });

  it('should invoke the linter with the options that were passed to the executor', async () => {
    const { success } = await executor(defaultOptions, mockContext);

    expect(success).toBeTruthy();
    expect(mockLint).toHaveBeenCalledWith({
      configFile: stylelintConfigFile,
      configBasedir: '/root',
      files: ['styles.scss'],
      reportNeedlessDisables: true,
      formatter: 'string',
      fix: false,
    });
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
