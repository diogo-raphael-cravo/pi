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
      if(!Constants.NAME_SYMBOLS.includes(parsed[0])) {
        return null;
      }
      parsed = parsed.substr(1);
    }
    return new Name(string);
  }
  equals(obj) {
    if (!(obj instanceof Name)) {
      return false;
    }
    return this.name === obj.name;
  }
  // array: array of Names that may contain duplicates
  // return: set of unique Names 
  static uniqueSet(array) {
    const uniques = new Set(array.map(n => n.name));
    return new Set([...uniques].map(u => new Name(u)));
  }
}

module.exports = Name;