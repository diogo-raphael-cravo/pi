'use strict';

const Constants = require('./constants');
const Process = require('./process');

class Replication extends Process {
  static REPLICATION() {
    return '!';
  }
  constructor(proc) {
    super();
    if (!proc) {
      throw new Error('Missing arguments for Replication constructor');
    }
    if (!(proc instanceof Process)) {
      throw new Error('Replication constructor requires a process');
    }
    this.process = proc;
  }
  print() {
    return `${Replication.REPLICATION()}${this.process.print()}`;
  }
  static parse(string, parser) {
    if (!string || !parser) {
      return Constants.DOES_NOT_PARSE;
    }
    if (!string.startsWith(Replication.REPLICATION())) {
      return Constants.DOES_NOT_PARSE;
    }
    const proc = parser(string.substr(1));
    if (proc === Constants.DOES_NOT_PARSE) {
      return Constants.DOES_NOT_PARSE;
    }
    return new Replication(proc);
  }
}

module.exports = Replication;