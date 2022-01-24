import { formatters as stylelintFormatters } from 'stylelint';
import { formatters } from './formatter';

it('formatters constant should contain all stylelint formatters', () => {
  expect(formatters).toStrictEqual(Object.keys(stylelintFormatters));
});
