'use strict';

const Inaction = require('./inaction');
const Parser = require('./parser');
const Constants = require('./constants');
const Composition = require('./composition');
const Summation = require('./summation');

test('Does not parse undefined', () => {
  expect(Parser.parse(undefined, Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
});
test('Does not parse empty', () => {
  expect(Parser.parse(' ', Parser.parse)).toBe(Constants.DOES_NOT_PARSE);
});
test('Parses ok', () => {
  expect(Parser.parse('{0}', Parser.parse))
    .toStrictEqual(new Inaction());
});
test('Finds end of paranthesis', () => {
	expect(Parser.splitParenthesis('{0}')).toBe(Constants.DOES_NOT_PARSE);
	expect(Parser.splitParenthesis('{00')).toBe(Constants.DOES_NOT_PARSE);
	expect(Parser.splitParenthesis('{{0}0')).toBe(Constants.DOES_NOT_PARSE);
	expect(Parser.splitParenthesis('{0}0')).toBe(Constants.DOES_NOT_PARSE);
	expect(Parser.splitParenthesis('{{0}0}}0')).toBe(Constants.DOES_NOT_PARSE);
	expect(Parser.splitParenthesis('{{0)0}x0')).toBe(Constants.DOES_NOT_PARSE);
	expect(Parser.splitParenthesis('{{0}0}|0')).toStrictEqual({
		string: '{{0}0}',
		op: '|',
		rest: '0',
	});
	expect(Parser.splitParenthesis('{{0}0}+0')).toStrictEqual({
		string: '{{0}0}',
		op: '+',
		rest: '0',
	});
});
test('Parses parenthesis', () => {
	expect(Parser.parse('{0|0}+0'))
		.toStrictEqual(new Summation(new Composition(new Inaction(), new Inaction()), new Inaction()));
	expect(Parser.parse('0|{0|0}'))
		.toStrictEqual(new Composition(new Inaction(), new Composition(new Inaction(), new Inaction())));
	expect(Parser.parse('{0|0}|0'))
		.toStrictEqual(new Composition(new Composition(new Inaction(), new Inaction()), new Inaction()));
});