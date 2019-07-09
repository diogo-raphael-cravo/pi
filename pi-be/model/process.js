'use strict';

const Constants = require('./constants');

class Process {
  static greatestIndex(array) {
    return array.reduce((prev, curr) => {
      if (prev < curr) {
        return curr;
      }
      return prev;
    }, 0);
	}
	static countParenthesis(string, count=0) {
		if (string.length === 0) {
			return Constants.DOES_NOT_PARSE;
		}
		if (string.startsWith(Constants.OPEN_PARENTHESIS)) {
			return countParenthesis(string.substr(1), count + 1);
		}
		if (string.startsWith(Constants.CLOSE_PARENTHESIS)) {
			return countParenthesis(string.substr(1), count - 1);
		}
		
	}
}

module.exports = Process;