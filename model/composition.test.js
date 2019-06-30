'use strict';

const Composition = require('./composition');
const Parser = require('./parser');
const Constants = require('./constants');

test('Does not parse undefined', () => {
  expect(Composition.parse(undefined, Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
});
test('Does not parse missing lhs or rhs', () => {
  expect(Composition.parse('|', Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
  expect(Composition.parse('|a', Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
  expect(Composition.parse('a|', Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
});