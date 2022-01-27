import { formatFiles, getProjects, updateProjectConfiguration } from '@nrwl/devkit';
import type { Tree } from '@nrwl/devkit';

export default async function update(host: Tree) {
  for (const [projectName, project] of getProjects(host)) {
    if (!project.targets) {
      continue;
    }

    for (const target of Object.values(project.targets).filter((t) => t.executor === 'nx-stylelint:lint')) {
      target.options = {
        ...target.options,
        configFile: target.options.config,
      };

      delete target.options.config;
    }

    updateProjectConfiguration(host, projectName, project);
  }

  await formatFiles(host);
}
