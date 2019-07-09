'use strict';

const Rule = require('./rule');
const MatchPrefix = require('../model/match-prefix');

class SCMatRule extends Rule {
	static NAME() {
		return 'SC-MAT';
	}
	static forward(lhs) {
		if (!(lhs instanceof MatchPrefix)) {
			throw new Error('SCMatRule FW lhs must be an instance of MatchPrefix');
		}
		if (!lhs.lhs.equals(lhs.rhs)) {
			throw new Error('SCMatRule FW lhs names must be the same');
		}
		return new SCMatRule(lhs, lhs.process);
	}
	static backward(name, rhs) {
		return new SCMatRule(new MatchPrefix(name, name, rhs), rhs);
	}
}

module.exports = SCMatRule;