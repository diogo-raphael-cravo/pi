'use strict';

const Rule = require('./rule');
const Summation = require('../model/summation');

class SCSumAssoc extends Rule {
	static NAME() {
		return 'SC-SUM-ASSOC';
	}
	static forward(process) {
		if (!(process instanceof Summation)) {
			throw new Error('SCSumAssoc FW process must be an instance of Summation');
		}
		if (!(process.rhs instanceof Summation)) {
			throw new Error('SCSumAssoc FW rhs must be an instance of Summation');
		}
		return new SCSumAssoc(process, 
			new Summation(new Summation(process.lhs, process.rhs.lhs), process.rhs.rhs));
	}
	static backward(name, rhs) {
		return new SCMatRule(new MatchPrefix(name, name, rhs), rhs);
	}
}

module.exports = SCSumAssoc;