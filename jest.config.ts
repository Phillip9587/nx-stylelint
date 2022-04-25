import { getJestProjects } from '@nrwl/jest';
import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  projects: getJestProjects(),
};

export default config;
