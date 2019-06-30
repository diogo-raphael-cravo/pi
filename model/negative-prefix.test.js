'use strict';

const NegativePrefix = require('./negative-prefix');
const Inaction = require('./inaction');
const Name = require('./name');
const Parser = require('./parser');
const Constants = require('./constants');

test('Does not parse undefined', () => {
  expect(NegativePrefix.parse(undefined, Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
});
test('Does not parse missing process', () => {
  expect(NegativePrefix.parse('x y', Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
  expect(NegativePrefix.parse('x y.', Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
});
test('Does not parse missing delimiters', () => {
  expect(NegativePrefix.parse('xy.0', Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
  expect(NegativePrefix.parse('x y0', Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
});
test('Does not parse excess delimiters', () => {
  expect(NegativePrefix.parse('x y..0', Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
});
test('Does not parse bad names', () => {
  expect(NegativePrefix.parse('.0', Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
  expect(NegativePrefix.parse('x.0', Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
  expect(NegativePrefix.parse('! !.0', Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
});
test('Parses ok', () => {
  expect(NegativePrefix.parse('x y.0', Parser.parse))
    .toStrictEqual(new NegativePrefix(new Name('x'), new Name('y'), new Inaction()));
});