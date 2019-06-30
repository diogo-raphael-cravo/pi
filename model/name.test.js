'use strict';

const Name = require('./name');
const Parser = require('./parser');
const Constants = require('./constants');

test('Does not parse undefined', () => {
  expect(Name.parse(undefined, Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
});
test('Does not parse bad characters', () => {
  expect(Name.parse('A', Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
});
test('Parses ok', () => {
  expect(Name.parse('as92ndas2', Parser.parse))
    .toStrictEqual(new Name('as92ndas2'));
});