import { convertNxExecutor } from '@nrwl/devkit';

import { lintExecutor } from './executor';

export default convertNxExecutor(lintExecutor);
