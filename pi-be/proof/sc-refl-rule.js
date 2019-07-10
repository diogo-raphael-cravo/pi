'use strict';

const Rule = require('./rule');
const Process = require('../model/process');

class SCReflRule extends Rule {
  static NAME() {
    return 'SC-REFL';
  }
  static forward(lhs) {
    if (!(lhs instanceof Process)) {
      throw new Error('SCReflRule FW lhs must be an instance of Process');
    }
    return new SCReflRule(lhs, lhs);
  }
  static backward(rhs) {
    return SCReflRule.forward(rhs);
  }
}

module.exports = SCReflRule;