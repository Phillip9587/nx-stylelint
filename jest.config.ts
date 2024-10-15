import { getJestProjectsAsync } from '@nx/jest';
import type { Config } from '@jest/types';

export default async (): Promise<Config.InitialOptions> => ({
  projects: await getJestProjectsAsync(),
});
