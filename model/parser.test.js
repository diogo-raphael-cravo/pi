'use strict';

const Inaction = require('./inaction');
const Parser = require('./parser');
const Constants = require('./constants');

test('Does not parse undefined', () => {
  expect(Parser.parse(undefined, Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
});
test('Does not parse empty', () => {
  expect(Parser.parse(' ', Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
});
test('Parses ok', () => {
  expect(Parser.parse('(0)', Parser.parse))
    .toStrictEqual(new Inaction());
});