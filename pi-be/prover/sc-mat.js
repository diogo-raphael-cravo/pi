'use strict';

const MatchPrefix = require('../model/match-prefix');

class SCMat {
  constructor(lhs, rhs) {
    this.lhs = lhs;
    this.rhs = rhs;
  }
  static applicable(process) {
    if (!(process instanceof MatchPrefix)) {
      return false;
    }
    return process.lhs === process.rhs;
  }
  static applyForward(process) {
    return new SCMat(process, process.proc);
  }
  static applyBackward(process, name) {
    return new SCMat(new MatchPrefix(name, name, process), process);
  }
}

module.exports = SCMat;