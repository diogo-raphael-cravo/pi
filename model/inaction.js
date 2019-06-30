'use strict';

const Constants = require('./constants');
const Process = require('./process');

class Inaction extends Process {
  static INACTION() {
    return '0';
  }
  print() {
    return Inaction.INACTION();
  }
  static parse(string) {
    if (!string) {
      return Constants.DOES_NOT_PARSE;
    }
    if (string !== Inaction.INACTION()) {
      return Constants.DOES_NOT_PARSE;
    }
    return new Inaction();
  }
}

module.exports = Inaction;