'use strict';

const Constants = require('./constants');
const Composition = require('./composition');
const Summation = require('./summation');
const Restriction = require('./restriction');
const Replication = require('./replication');
const Inaction = require('./inaction');
const NegativePrefix = require('./negative-prefix');
const PositivePrefix = require('./positive-prefix');
const SilentPrefix = require('./silent-prefix');
const MatchPrefix = require('./match-prefix');

class Parser {
  static parse(string) {
    if (!string || typeof string !== 'string') {
      return Constants.DOES_NOT_PARSE;
    }
    let trimmed = string.trim();
    if (!trimmed) {
      return Constants.DOES_NOT_PARSE;
    }
    if (trimmed.startsWith('(') && trimmed.endsWith(')')) {
      trimmed = trimmed.substr(0, trimmed.length - 1).substr(1).trim();
    }
    return Summation.parse(trimmed, Parser.parse)
      || Composition.parse(trimmed, Parser.parse)
      || Restriction.parse(trimmed, Parser.parse)
      || Replication.parse(trimmed, Parser.parse)
      || Inaction.parse(trimmed, Parser.parse)
      || NegativePrefix.parse(trimmed, Parser.parse)
      || PositivePrefix.parse(trimmed, Parser.parse)
      || SilentPrefix.parse(trimmed, Parser.parse)
      || MatchPrefix.parse(trimmed, Parser.parse);
  }
}

module.exports = Parser;