'use strict';

const Constants = require('./constants');
const Process = require('./process');
const Name = require('./name');
const Prefix = require('./prefix');

class MatchPrefix extends Prefix {
  constructor(lhs, rhs, proc) {
    super();
    if (!lhs || !rhs || !proc) {
      throw new Error('Missing arguments for MatchPrefix constructor');
    }
    if (!(lhs instanceof Name) || !(rhs instanceof Name) || !(proc instanceof Process)) {
      throw new Error('MatchPrefix constructor requires two names and a process');
    }
    this.lhs = lhs;
    this.rhs = rhs;
    this.process = proc;
  }
  print() {
    return `[${this.lhs.print()}=${this.rhs.print()}]${Prefix.PREFIX_DELIMITER()}${this.process.print()}`;
  }
  static parse(string, parser) {
    if (!string || !parser) {
      return Constants.DOES_NOT_PARSE;
    }
    const split = string.split(Prefix.PREFIX_DELIMITER());
    if (split.length === 1) {
      return Constants.DOES_NOT_PARSE;
    }
    const prefix = split[0];
    if (!prefix.startsWith('[') || !prefix.endsWith(']')) {
      return Constants.DOES_NOT_PARSE;
    }
    const trimmedPrefix = prefix.substr(0, prefix.length - 1).substr(1);
    const names = trimmedPrefix.split('=');
    if (names.length !== 2) {
      return Constants.DOES_NOT_PARSE;
    }
    const lhs = Name.parse(names[0]);
    const rhs = Name.parse(names[1]);
    if (lhs === Constants.DOES_NOT_PARSE || rhs === Constants.DOES_NOT_PARSE) {
      return Constants.DOES_NOT_PARSE;
    }

    const proc = parser(split.slice(1).join(Prefix.PREFIX_DELIMITER()));
    if (proc === Constants.DOES_NOT_PARSE) {
      return Constants.DOES_NOT_PARSE;
    }
    return new MatchPrefix(lhs, rhs, proc);
  }
  n() {
    return Name.uniqueSet([...new Set([this.lhs, this.rhs]), ...this.process.n()]);
  }
  fn() {
    return Name.uniqueSet([...new Set([this.lhs, this.rhs]), ...this.process.fn()]);
  }
  bn() {
    return this.process.bn();
  }
}

module.exports = MatchPrefix;