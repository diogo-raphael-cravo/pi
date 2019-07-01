'use strict';

const Process = require('./process');

class Prefix extends Process {
  static PREFIX_DELIMITER() {
    return '.';
  }
}

module.exports = Prefix;