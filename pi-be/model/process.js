'use strict';

class Process {
  static greatestIndex(array) {
    return array.reduce((prev, curr) => {
      if (prev < curr) {
        return curr;
      }
      return prev;
    }, 0);
  }
}

module.exports = Process;