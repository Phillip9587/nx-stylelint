import { formatFiles, getProjects, joinPathFragments, updateProjectConfiguration } from '@nx/devkit';
import type { Tree } from '@nx/devkit';

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

function removeConfigTargetOption(host: Tree) {
  for (const [projectName, project] of getProjects(host)) {
    if (!project.targets) {
      continue;
    }

    for (const target of Object.values(project.targets).filter((t) => t.executor === 'nx-stylelint:lint')) {
      if (target.options.config === joinPathFragments(project.root, '.stylelintrc.json')) delete target.options.config;
    }

    updateProjectConfiguration(host, projectName, project);
  }
}

export default async function updateStylelintTargets(host: Tree) {
  addOutputs(host);
  changeFormatToFormatter(host);
  removeConfigTargetOption(host);

  await formatFiles(host);
}
