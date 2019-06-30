'use strict';

const Constants = require('./constants');
const Process = require('./process');
const Name = require('./name');
const Prefix = require('./prefix');

class PositivePrefix extends Prefix {
  constructor(channel, subject, proc) {
    super();
    if (!channel || !subject || !proc) {
      throw new Error('Missing arguments for PositivePrefix constructor');
    }
    if (!(channel instanceof Name) || !(subject instanceof Name) || !(proc instanceof Process)) {
      throw new Error('PositivePrefix constructor requires two names and a process');
    }
    this.channel = channel;
    this.subject = subject;
    this.process = proc;
  }
  print() {
    return `${this.channel.print()}(${this.subject.print()})${Prefix.PREFIX_DELIMITER()}${this.process.print()}`;
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
    const names = prefix.split('(');
    if (names.length !== 2 || !names[1].endsWith(')')) {
      return Constants.DOES_NOT_PARSE;
    }
    const channel = Name.parse(names[0]);
    const subject = Name.parse(names[1].substr(0, names[1].length - 1));
    if (channel === Constants.DOES_NOT_PARSE || subject === Constants.DOES_NOT_PARSE) {
      return Constants.DOES_NOT_PARSE;
    }

    const proc = parser(split.slice(1).join(Prefix.PREFIX_DELIMITER()));
    if (proc === Constants.DOES_NOT_PARSE) {
      return Constants.DOES_NOT_PARSE;
    }
    return new PositivePrefix(channel, subject, proc);
  }
}

module.exports = PositivePrefix;