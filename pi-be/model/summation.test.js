'use strict';

const Summation = require('./summation');
const Inaction = require('./inaction');
const Parser = require('./parser');
const Constants = require('./constants');
const Name = require('./name');

test('Does not parse undefined', () => {
  expect(Summation.parse(undefined, Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
});
test('Does not parse missing lhs or rhs', () => {
  expect(Summation.parse('+', Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
  expect(Summation.parse('+0', Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
  expect(Summation.parse('0+', Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
});
test('Parses ok', () => {
  expect(Summation.parse('0+0+0', Parser.parse))
    .toStrictEqual(new Summation(new Inaction(), new Summation(new Inaction(), new Inaction())));
});
test('Gets names', () => {
  expect(Summation.parse('a(b).0+c(d).0', Parser.parse).n())
    .toStrictEqual(new Set([new Name('a'), new Name('b'), new Name('c'), new Name('d')]));
  expect(Summation.parse('a(b).0+c(d).0', Parser.parse).fn())
    .toStrictEqual(new Set([new Name('a'), new Name('c')]));
  expect(Summation.parse('a(b).0+c(d).0', Parser.parse).bn())
    .toStrictEqual(new Set([new Name('b'), new Name('d')]));
});