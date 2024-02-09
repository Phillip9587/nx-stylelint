import { formatters } from 'stylelint';
import { importFormatter } from './formatter';

describe('importFormatter()', () => {
  it('should return stylelint core formatter key when given', async () => {
    for (const formatterKey of Object.keys(formatters)) {
      expect(await importFormatter(formatterKey)).toStrictEqual(formatterKey);
    }
  });
});
