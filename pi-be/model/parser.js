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
	// should be used on a string that starts with (
	static splitParenthesis(rest, string = '', count = 0) {
		if (!rest) {
			return Constants.DOES_NOT_PARSE;
		}
		let newCount = count;
		if (rest.startsWith(Constants.CLOSE_PARENTHESIS)) {
			newCount = count - 1;
		} else if (rest.startsWith(Constants.OPEN_PARENTHESIS)) {
			newCount = count + 1;
		} else if (count === 0) {
			if (rest.length <= 1) {
				return Constants.DOES_NOT_PARSE;
			}
			const op = rest[0];
			if (op !== Composition.COMPOSITION() && op !== Summation.SUM()) {
				return Constants.DOES_NOT_PARSE;
			}
			return {
				op,
				string,
				rest: rest.substr(1),
			};
		}
		return Parser.splitParenthesis(rest.substr(1), `${string}${rest[0]}`, newCount);
	}
  static parse(string) {
    if (!string || typeof string !== 'string') {
      return Constants.DOES_NOT_PARSE;
    }
    let trimmed = string.trim();
    if (!trimmed) {
      return Constants.DOES_NOT_PARSE;
    }
    while (trimmed.startsWith(Constants.OPEN_PARENTHESIS)
      && trimmed.endsWith(Constants.CLOSE_PARENTHESIS)) {
      trimmed = trimmed.substr(0, trimmed.length - 1).substr(1).trim();
		}
		if (trimmed.startsWith(Constants.OPEN_PARENTHESIS)) {
			const split = Parser.splitParenthesis(trimmed);
			if (!split) {
				return Constants.DOES_NOT_PARSE;
			}
			const lhs = Parser.parse(split.string);
			if (lhs === Constants.DOES_NOT_PARSE) {
				return Constants.DOES_NOT_PARSE;
			}
			const rhs = Parser.parse(split.rest);
			if (rhs === Constants.DOES_NOT_PARSE) {
				return Constants.DOES_NOT_PARSE;
			}
			if (split.op === Summation.SUM()) {
				return new Summation(lhs, rhs);
			} else {
				return new Composition(lhs, rhs);
			}
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