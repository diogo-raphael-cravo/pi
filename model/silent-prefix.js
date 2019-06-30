'use strict';

const Constants = require('./constants');
const Process = require('./process');
const Prefix = require('./prefix');

class SilentPrefix extends Prefix {
  static TAU() {
    return 't';
  }
  constructor(proc) {
    super();
    if (!proc) {
      throw new Error('Missing arguments for SilentPrefix constructor');
    }
    if (!(proc instanceof Process)) {
      throw new Error('SilentPrefix constructor requires a process');
    }
    this.process = proc;
  }
  print() {
    return `${UNICODE_TAU}${Prefix.PREFIX_DELIMITER()}${this.process.print()}`;
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
    if (prefix !== SilentPrefix.TAU()) {
      return Constants.DOES_NOT_PARSE;
    }

    const proc = parser(split.slice(1).join(Prefix.PREFIX_DELIMITER()));
    if (proc === Constants.DOES_NOT_PARSE) {
      return Constants.DOES_NOT_PARSE;
    }
    return new SilentPrefix(proc);
  }
}

module.exports = SilentPrefix;