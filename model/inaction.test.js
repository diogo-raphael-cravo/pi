'use strict';

const Inaction = require('./inaction');
const Parser = require('./parser');
const Constants = require('./constants');

test('Does not parse undefined', () => {
  expect(Inaction.parse(undefined, Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
});
test('Does not parse name', () => {
  expect(Inaction.parse('a0', Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
});
test('Parses ok', () => {
  expect(Inaction.parse('0', Parser.parse))
    .toStrictEqual(new Inaction());
});