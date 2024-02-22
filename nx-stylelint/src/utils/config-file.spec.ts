import { vol } from 'memfs';
import { Config } from 'stylelint';
import { getInputConfigFiles } from './config-file';

jest.mock('node:fs', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require('memfs').fs;
});
jest.mock('fs', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require('memfs').fs;
});
jest.mock('fs/promises', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require('memfs').fs.promises;
});

const sc = (config: Config) => JSON.stringify(config);

describe(getInputConfigFiles.name, () => {
  afterEach(() => {
    vol.reset();
    jest.resetModules();
  });

  it('should return all configured stylelint files and ignore other ones', async () => {
    vol.fromJSON(
      {
        'apps/my-app/.stylelintrc.json': JSON.stringify({
          extends: ['../.stylelintrc.yaml', 'stylelint-config-standard'],
        }),
        'apps/.stylelintrc.yaml': `extends:
  - ./.stylelintrc.json`,
        'apps/.stylelintrc.json': sc({
          extends: '../.stylelintrc',
          overrides: [
            { files: ['**/*.scss'], extends: ['stylelint-config-standard-scss', '../.stylelintrc.scss.json'] },
          ],
        }),
        '.stylelintrc.scss.json': sc({}),
        '.stylelintrc.yaml': 'extends: stylelint-config-recommended',
        '.stylelintrc': sc({ extends: 'stylelint-config-recommended' }),
        'package.json': `{}`,
      },
      '',
    );

    const configFiles = await getInputConfigFiles('apps/my-app/.stylelintrc.json', 'apps/my-app');

    expect(configFiles).toMatchInlineSnapshot(`
      [
        "{projectRoot}/.stylelintrc.json",
        "{workspaceRoot}/.stylelintrc",
        "{workspaceRoot}/.stylelintrc.scss.json",
        "{workspaceRoot}/apps/.stylelintrc.json",
        "{workspaceRoot}/apps/.stylelintrc.yaml",
      ]
    `);
  });
});
