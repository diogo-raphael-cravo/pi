'use strict';

const PositivePrefix = require('./positive-prefix');
const Inaction = require('./inaction');
const Name = require('./name');
const Parser = require('./parser');
const Constants = require('./constants');

test('Does not parse undefined', () => {
  expect(PositivePrefix.parse(undefined, Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
});
test('Does not parse missing process', () => {
  expect(PositivePrefix.parse('x(y)', Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
  expect(PositivePrefix.parse('x(y).', Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
});
test('Does not parse missing delimiters', () => {
  expect(PositivePrefix.parse('xy).0', Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
  expect(PositivePrefix.parse('x(y.0', Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
  expect(PositivePrefix.parse('x(y)0', Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
});
test('Does not parse excess delimiters', () => {
  expect(PositivePrefix.parse('x((y).0', Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
  expect(PositivePrefix.parse('x(y)).0', Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
  expect(PositivePrefix.parse('x(y)..0', Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
});
test('Does not parse bad names', () => {
  expect(PositivePrefix.parse('.0', Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
  expect(PositivePrefix.parse('x().0', Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
  expect(PositivePrefix.parse('(y).0', Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
  expect(PositivePrefix.parse('!(y).0', Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
  expect(PositivePrefix.parse('x(!).0', Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
});
test('Parses ok', () => {
  expect(PositivePrefix.parse('x(y).0', Parser.parse))
    .toStrictEqual(new PositivePrefix(new Name('x'), new Name('y'), new Inaction()));
});
test('Gets names', () => {
  expect(PositivePrefix.parse('a(b).c(d).0', Parser.parse).n())
    .toStrictEqual(new Set([new Name('a'), new Name('b'), new Name('c'), new Name('d')]));
  expect(PositivePrefix.parse('a(b).c(d).0', Parser.parse).fn())
    .toStrictEqual(new Set([new Name('a'), new Name('c')]));
  expect(PositivePrefix.parse('a(b).c(d).0', Parser.parse).bn())
    .toStrictEqual(new Set([new Name('b'), new Name('d')]));
});
test('Gets names with repeated names', () => {
  expect(PositivePrefix.parse('a(b).b(d).0', Parser.parse).n())
    .toStrictEqual(new Set([new Name('a'), new Name('b'), new Name('d')]));
  expect(PositivePrefix.parse('a(b).b(d).0', Parser.parse).fn())
    .toStrictEqual(new Set([new Name('a')]));
  expect(PositivePrefix.parse('a(b).b(d).0', Parser.parse).bn())
    .toStrictEqual(new Set([new Name('b'), new Name('d')]));

  expect(PositivePrefix.parse('a(b).a(d).0', Parser.parse).n())
    .toStrictEqual(new Set([new Name('a'), new Name('b'), new Name('d')]));
  expect(PositivePrefix.parse('a(b).a(d).0', Parser.parse).fn())
    .toStrictEqual(new Set([new Name('a')]));
  expect(PositivePrefix.parse('a(b).a(d).0', Parser.parse).bn())
    .toStrictEqual(new Set([new Name('b'), new Name('d')]));

  expect(PositivePrefix.parse('a(b).d(a).0', Parser.parse).n())
    .toStrictEqual(new Set([new Name('a'), new Name('b'), new Name('d')]));
  expect(PositivePrefix.parse('a(b).d(a).0', Parser.parse).fn())
    .toStrictEqual(new Set([new Name('a'), new Name('d')]));
  expect(PositivePrefix.parse('a(b).d(a).0', Parser.parse).bn())
    .toStrictEqual(new Set([new Name('b')]));
});