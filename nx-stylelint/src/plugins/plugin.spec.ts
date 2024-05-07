import { CreateNodesContext } from '@nx/devkit';
import { vol } from 'memfs';
import { createNodes } from './plugin';

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

describe('nx-stylelint/plugin', () => {
  const createNodesFunction = createNodes[1];
  let context: CreateNodesContext;

  beforeEach(async () => {
    context = {
      nxJsonConfiguration: {
        // These defaults should be overridden by plugin
        targetDefaults: {
          stylelint: {
            cache: false,
            inputs: ['foo', '^foo'],
          },
        },
        namedInputs: {
          default: ['{projectRoot}/**/*'],
          production: ['!{projectRoot}/**/*.spec.ts'],
        },
      },
      workspaceRoot: '',
      configFiles: [],
    };
  });

  afterEach(() => {
    vol.reset();
    jest.resetModules();
  });

  it('should create nodes for nested project', async () => {
    vol.fromJSON(
      {
        'apps/my-app/.stylelintrc.json': JSON.stringify({
          extends: ['../.stylelintrc.yaml', 'stylelint-config-standard'],
        }),
        'apps/my-app/project.json': `{}`,
        'apps/.stylelintrc.yaml': `extends:
  - ../.stylelintrc.json`,
        '.stylelintrc.json': JSON.stringify({ extends: ['stylelint-config-standard'] }),
        'package.json': `{}`,
      },
      ''
    );

    const nodes = await createNodesFunction('apps/my-app/.stylelintrc.json', {}, context);

    expect(nodes).toMatchInlineSnapshot(`
      {
        "projects": {
          "apps/my-app": {
            "root": "apps/my-app",
            "targets": {
              "stylelint": {
                "cache": true,
                "command": "stylelint "**/*.css"",
                "inputs": [
                  "default",
                  "^default",
                  "{projectRoot}/.stylelintrc.json",
                  "{workspaceRoot}/.stylelintrc.json",
                  "{workspaceRoot}/apps/.stylelintrc.yaml",
                  {
                    "externalDependencies": [
                      "stylelint",
                    ],
                  },
                ],
                "options": {
                  "cwd": "apps/my-app",
                },
              },
            },
          },
        },
      }
    `);
  });

  it('should not create targets when there is no project.json or package.json', async () => {
    vol.fromJSON(
      {
        'apps/my-app/.stylelintrc.json': JSON.stringify({
          extends: ['../../.stylelintrc.json'],
        }),
        '.stylelintrc.json': JSON.stringify({ extends: ['stylelint-config-standard'] }),
        'package.json': `{}`,
      },
      ''
    );

    const nodes = await createNodesFunction('apps/my-app/.stylelintrc.json', {}, context);

    expect(nodes).toStrictEqual({});
  });
});
