'use strict';

const Summation = require('./summation');
const Inaction = require('./inaction');
const Parser = require('./parser');
const Constants = require('./constants');

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