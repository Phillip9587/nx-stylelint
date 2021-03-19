import { LintExecutorSchema } from './schema';
import * as fs from 'fs';
import { ExecutorContext } from '@nrwl/devkit';
import { LinterResult } from 'stylelint';
import { logger } from '@nrwl/devkit';
import { normalize } from 'path';
import { stylelintConfigFile } from '../../defaults';

const defaultOptions: LintExecutorSchema = {
  config: stylelintConfigFile,
  lintFilePatterns: ['styles.scss'],
  format: 'string',
  silent: false,
  force: false,
  fix: false,
  maxWarnings: -1,
};

let mockResult: LinterResult = {
  errored: false,
  output: '',
  results: [],
};
jest.spyOn(fs, 'writeFileSync').mockImplementation();
jest.spyOn(fs, 'writeFileSync').mockImplementation();
const mockLint = jest.fn().mockImplementation(() => mockResult);
jest.mock('stylelint', () => {
  return {
    lint: mockLint,
  };
});
import executor from './executor';

function setupMocks() {
  jest.resetModules();
  jest.clearAllMocks();
  jest.spyOn(process, 'chdir').mockImplementation(jest.fn());
  logger.warn = jest.fn();
  logger.error = jest.fn();
  logger.info = jest.fn();
}

describe('lint executor', () => {
  let mockContext: ExecutorContext;

  beforeEach(() => {
    mockContext = {
      projectName: undefined,
      root: '/root',
      cwd: '/root',
      workspace: {
        version: 2,
        projects: {},
      },
      isVerbose: false,
    };
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should invoke the linter with the options that were passed to the executor', async () => {
    setupMocks();
    await executor(defaultOptions, mockContext);
    expect(mockLint).toHaveBeenCalledWith({
      configFile: stylelintConfigFile,
      configBasedir: '/root',
      files: ['styles.scss'],
      reportNeedlessDisables: true,
      formatter: 'string',
      fix: false,
    });
  });

  it('should not log if the silent flag was passed', async () => {
    mockResult = { errored: true, output: 'Output', results: [] };
    setupMocks();
    await executor({ ...defaultOptions, silent: true }, mockContext);

    expect(logger.info).not.toHaveBeenCalledWith('\nLinting Styles "<???>"...');
    expect(logger.error).not.toHaveBeenCalledWith('\nLint errors found in the listed files.');
    expect(logger.warn).not.toHaveBeenCalledWith('\nLint warnings found in the listed files.');
    expect(logger.info).not.toHaveBeenCalledWith('\nAll files pass linting.');
  });

  it('should log if there are no warnings or errors', async () => {
    mockResult = { errored: false, output: '', results: [] };
    setupMocks();
    await executor(defaultOptions, mockContext);

    expect(logger.info).toHaveBeenCalledWith('\nLinting Styles "<???>"...');
    expect(logger.error).not.toHaveBeenCalledWith('\nLint errors found in the listed files.');
    expect(logger.warn).not.toHaveBeenCalledWith('\nLint warnings found in the listed files.');
    expect(logger.info).toHaveBeenCalledWith('\nAll files pass linting.');
  });

  it('should attempt to write the lint results to the output file, if specified', async () => {
    mockResult = { errored: true, output: 'Output', results: [] };
    setupMocks();
    await executor(
      {
        ...defaultOptions,
        outputFile: 'output.json',
      },
      mockContext
    );

    expect(fs.writeFileSync).toHaveBeenCalledWith(normalize('/root/output.json'), 'Output');
  });

  it('should not attempt to write the lint results to the output file, if not specified', async () => {
    setupMocks();
    jest.spyOn(fs, 'writeFileSync').mockImplementation();
    await executor(defaultOptions, mockContext);
    expect(fs.writeFileSync).not.toHaveBeenCalled();
  });
});
