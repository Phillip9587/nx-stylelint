import {
  NxJsonConfiguration,
  readJson,
  readWorkspaceConfiguration,
  Tree,
  updateJson,
  updateWorkspaceConfiguration,
} from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import migrateToInputs from './migrate-to-inputs';

describe('migrate-to-inputs', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
  });

  it('should remove .stylelintrc.json from implicitDependencies but leave others if present', async () => {
    updateWorkspaceConfiguration(tree, {
      version: 2,
      targetDefaults: {
        build: {
          dependsOn: ['^build'],
        },
      },
      implicitDependencies: {
        '.stylelintrc.json': '*',
        '.configfile.json': '*',
      },
    });
    await migrateToInputs(tree);

    const updated = readWorkspaceConfiguration(tree);

    expect(updated.implicitDependencies).toStrictEqual({ '.configfile.json': '*' });
  });

  describe('targetDefaults', () => {
    it('should add targetDefaults for stylelint', async () => {
      updateJson<NxJsonConfiguration>(tree, 'nx.json', (json) => {
        json.namedInputs ??= {};
        json.namedInputs['production'] = ['default'];
        return json;
      });

      await migrateToInputs(tree);

      const nxConfig = readJson<NxJsonConfiguration>(tree, 'nx.json');
      expect(nxConfig.targetDefaults?.['stylelint']).toStrictEqual({
        inputs: ['default', `{workspaceRoot}/.stylelintrc(.(json|yml|yaml|js))?`],
      });
      expect(nxConfig.namedInputs?.['production']).toContain(`!{projectRoot}/.stylelintrc(.(json|yml|yaml|js))?`);
    });

    it('should not create namedInputs production fileset if not present', async () => {
      updateJson<NxJsonConfiguration>(tree, 'nx.json', (json) => {
        json.namedInputs ??= {};
        delete json.namedInputs['production'];
        return json;
      });

      await migrateToInputs(tree);

      const nxConfig = readJson<NxJsonConfiguration>(tree, 'nx.json');
      expect(nxConfig.namedInputs?.['production']).toBeUndefined();
    });
  });

  it('should not make any changes if there is no nx.json', async () => {
    tree.delete('nx.json');

    await migrateToInputs(tree);

    expect(tree.exists('nx.json')).toEqual(false);
  });
});
