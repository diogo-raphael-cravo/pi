'use strict';

const Name = require('../model/name');
const Parser = require('../model/parser');
const SCMatRule = require('./sc-mat-rule');

test('Does not create when something else', () => {
	expect(() => SCMatRule.forward(Parser.parse('0'))).toThrow();
	expect(() => SCMatRule.backward('0', Parser.parse('0'))).toThrow();
	expect(() => SCMatRule.forward(new Name('0'), '0')).toThrow();
});
test('Does not allow different names', () => {
	expect(() => SCMatRule.forward(Parser.parse('[x=y].0'))).toThrow();
});
test('Creates new rule (forward application)', () => {
	const rule = SCMatRule.forward(Parser.parse('[x=x].0'));
	expect(rule.lhs).toStrictEqual(Parser.parse('[x=x].0'));
	expect(rule.rhs).toStrictEqual(Parser.parse('0'));
});
test('Creates new rule (backward application)', () => {
	const rule = SCMatRule.backward(new Name('foo'), Parser.parse('0'));
	expect(rule.lhs).toStrictEqual(Parser.parse('[foo=foo].0'));
	expect(rule.rhs).toStrictEqual(Parser.parse('0'));
});