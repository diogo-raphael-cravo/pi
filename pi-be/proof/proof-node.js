'use strict';

const Rule = require('./rule');

class ProofNode {
	constructor(rule, sources) {
		if (!(rule instanceof Rule)) {
			throw new Error('ProofNode rule must be a Rule');
		}
		this.rule = rule;

		sources.forEach(edge => {
			if (!(edge instanceof ProofNode)) {
				throw new Error('ProofNode sources must be instances of ProofNode');
			}
			edge.setSource(this);
		});
	}
}

module.exports = ProofNode;