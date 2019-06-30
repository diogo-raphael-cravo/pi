'use strict';

const MatchPrefix = require('./match-prefix');
const Inaction = require('./inaction');
const Name = require('./name');
const Parser = require('./parser');
const Constants = require('./constants');

test('Does not parse undefined', () => {
  expect(MatchPrefix.parse(undefined, Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
});
test('Does not parse missing process', () => {
  expect(MatchPrefix.parse('[x=y]', Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
  expect(MatchPrefix.parse('[x=y].', Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
});
test('Does not parse missing delimiters', () => {
  expect(MatchPrefix.parse('x=y].0', Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
  expect(MatchPrefix.parse('[xy].0', Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
  expect(MatchPrefix.parse('[x=y.0', Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
  expect(MatchPrefix.parse('[x=y]0', Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
});
test('Does not parse excess delimiters', () => {
  expect(MatchPrefix.parse('[[x=y].0', Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
  expect(MatchPrefix.parse('[x==y].0', Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
  expect(MatchPrefix.parse('[x=y]].0', Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
  expect(MatchPrefix.parse('[x=y]..0', Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
});
test('Parses ok', () => {
  expect(MatchPrefix.parse('[x=y].0', Parser.parse)).toStrictEqual(new MatchPrefix(new Name('x'), new Name('y'), new Inaction()));
});
test('Gets names', () => {
  expect(MatchPrefix.parse('[a=b].c(d).0', Parser.parse).n())
    .toStrictEqual(new Set([new Name('a'), new Name('b'), new Name('c'), new Name('d')]));
  expect(MatchPrefix.parse('[a=b].c(d).0', Parser.parse).fn())
    .toStrictEqual(new Set([new Name('a'), new Name('b'), new Name('c')]));
  expect(MatchPrefix.parse('[a=b].c(d).0', Parser.parse).bn())
    .toStrictEqual(new Set([new Name('d')]));
});