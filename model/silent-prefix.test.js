'use strict';

const SilentPrefix = require('./silent-prefix');
const Inaction = require('./inaction');
const Parser = require('./parser');
const Constants = require('./constants');

test('Does not parse undefined', () => {
  expect(SilentPrefix.parse(undefined, Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
});
test('Does not parse missing process', () => {
  expect(SilentPrefix.parse('t.', Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
});
test('Does not parse missing delimiters', () => {
  expect(SilentPrefix.parse('.0', Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
  expect(SilentPrefix.parse('t0', Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
});
test('Does not parse excess delimiters', () => {
  expect(SilentPrefix.parse('tt.0', Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
  expect(SilentPrefix.parse('t..0', Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
});
test('Does not missing tau', () => {
  expect(SilentPrefix.parse('x.0', Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
});
test('Parses ok', () => {
  expect(SilentPrefix.parse('t.0', Parser.parse))
    .toStrictEqual(new SilentPrefix(new Inaction()));
});