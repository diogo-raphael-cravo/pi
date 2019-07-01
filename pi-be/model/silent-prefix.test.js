'use strict';

const SilentPrefix = require('./silent-prefix');
const Inaction = require('./inaction');
const Parser = require('./parser');
const Constants = require('./constants');
const Name = require('./name');

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
test('Gets names', () => {
  expect(SilentPrefix.parse('t.a(b).0', Parser.parse).n())
    .toStrictEqual(new Set([new Name('a'), new Name('b')]));
  expect(SilentPrefix.parse('t.a(b).0', Parser.parse).fn())
    .toStrictEqual(new Set([new Name('a')]));
  expect(SilentPrefix.parse('t.a(b).0', Parser.parse).bn())
    .toStrictEqual(new Set([new Name('b')]));
});