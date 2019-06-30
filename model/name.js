'use strict';

const Constants = require('./constants');

class Name {
  constructor(name) {
    if (!name) {
      throw new Error('Missing arguments for Name constructor');
    }
    this.name = name;
  }
  print() {
    return this.name;
  }
  static parse(string) {
    if (!string) {
      return Constants.DOES_NOT_PARSE;
    }
    let parsed = string;
    while(parsed.length > 0) {
      if(!NAME_SYMBOLS.includes(parsed[0])) {
        return null;
      }
      parsed = parsed.substr(1);
    }
    return new Name(string);
  }
}

module.exports = Name;