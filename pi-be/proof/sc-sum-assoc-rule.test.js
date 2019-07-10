'use strict';

const Parser = require('../model/parser');
const SCSumAssoc = require('./sc-sum-assoc');

test('Does not create when something else', () => {
	expect(() => SCSumAssoc.forward(Parser.parse('0+0'))).toThrow();
	expect(() => SCSumAssoc.forward(Parser.parse('0+0|0'))).toThrow();
	expect(() => SCSumAssoc.forward(Parser.parse('0|0+0'))).toThrow();
});
test('Creates new rule (forward application)', () => {
	const rule = SCSumAssoc.forward(Parser.parse('(x)0+(y)0+(z)0'));
	expect(rule.lhs).toStrictEqual(Parser.parse('(x)0+{(y)0+(z)0}'));
	expect(rule.rhs).toStrictEqual(Parser.parse('{(x)0+(y)0}+(z)0'));
});
test('Creates new rule (backward application)', () => {
	/* const rule = SCMatRule.backward(new Name('foo'), Parser.parse('0'));
	expect(rule.lhs).toStrictEqual(Parser.parse('[foo=foo].0'));
	expect(rule.rhs).toStrictEqual(Parser.parse('0')); */
});