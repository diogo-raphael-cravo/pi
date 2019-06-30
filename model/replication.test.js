'use strict';

const Replication = require('./replication');
const Inaction = require('./inaction');
const Parser = require('./parser');
const Constants = require('./constants');

test('Does not parse undefined', () => {
  expect(Replication.parse(undefined, Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
});
test('Does not parse missing process', () => {
  expect(Replication.parse('!', Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
});
test('Does not parse missing delimiters', () => {
  expect(Replication.parse('0', Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
});
test('Parses ok', () => {
  expect(Replication.parse('!0', Parser.parse))
    .toStrictEqual(new Replication(new Inaction()));
  expect(Replication.parse('!!0', Parser.parse))
    .toStrictEqual(new Replication(new Replication(new Inaction())));
});