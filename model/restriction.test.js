'use strict';

const Restriction = require('./restriction');
const Inaction = require('./inaction');
const Name = require('./name');
const Parser = require('./parser');
const Constants = require('./constants');

test('Does not parse undefined', () => {
  expect(Restriction.parse(undefined, Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
});
test('Does not parse missing process', () => {
  expect(Restriction.parse('(x)', Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
});
test('Does not parse missing delimiters', () => {
  expect(Restriction.parse('x)0', Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
  expect(Restriction.parse('(x0', Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
});
test('Does not parse excess delimiters', () => {
  expect(Restriction.parse('((x)0', Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
  expect(Restriction.parse('(x))0', Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
});
test('Parses ok', () => {
  expect(Restriction.parse('(x)0', Parser.parse))
    .toStrictEqual(new Restriction(new Name('x'), new Inaction()));
});
test('Gets names', () => {
  expect(Restriction.parse('(a)(b)c(d).0', Parser.parse).n())
    .toStrictEqual(new Set([new Name('a'), new Name('b'), new Name('c'), new Name('d')]));
  expect(Restriction.parse('(a)(b)c(d).0', Parser.parse).fn())
    .toStrictEqual(new Set([new Name('c')]));
  expect(Restriction.parse('(a)(b)c(d).0', Parser.parse).bn())
    .toStrictEqual(new Set([new Name('a'), new Name('b'), new Name('d')]));
});
test('Gets names with repeated names', () => {
  console.log(Restriction.parse('(a)(c)c(d).0', Parser.parse).n())
  expect(Restriction.parse('(a)(c)c(d).0', Parser.parse).n())
    .toStrictEqual(new Set([new Name('a'), new Name('c'), new Name('d')]));
  expect(Restriction.parse('(a)(c)c(d).0', Parser.parse).fn())
    .toStrictEqual(new Set([]));
  expect(Restriction.parse('(a)(c)c(d).0', Parser.parse).bn())
    .toStrictEqual(new Set([new Name('a'), new Name('c'), new Name('d')]));
});