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