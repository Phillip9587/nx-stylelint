import { convertNxExecutor } from '@nx/devkit';

import { lintExecutor } from './executor';

export default convertNxExecutor(lintExecutor);
