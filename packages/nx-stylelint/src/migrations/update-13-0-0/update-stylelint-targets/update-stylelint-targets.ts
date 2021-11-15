import { formatFiles, getProjects, updateProjectConfiguration } from '@nrwl/devkit';
import type { Tree } from '@nrwl/devkit';

function addOutputs(host: Tree) {
  for (const [projectName, project] of getProjects(host)) {
    if (!project.targets) {
      continue;
    }

    for (const target of Object.values(project.targets).filter((t) => t.executor === 'nx-stylelint:lint')) {
      target.outputs = Array.from(new Set([...(target.outputs ?? []), '{options.outputFile}']));
    }

    updateProjectConfiguration(host, projectName, project);
  }
}

function changeFormatToFormatter(host: Tree) {
  for (const [projectName, project] of getProjects(host)) {
    if (!project.targets) {
      continue;
    }

    for (const target of Object.values(project.targets).filter((t) => t.executor === 'nx-stylelint:lint')) {
      target.options = {
        ...target.options,
        formatter: target.options.format,
      };

      delete target.options.format;
    }

    updateProjectConfiguration(host, projectName, project);
  }
}

export default async function updateStylelintTargets(host: Tree) {
  addOutputs(host);
  changeFormatToFormatter(host);

  await formatFiles(host);
}
