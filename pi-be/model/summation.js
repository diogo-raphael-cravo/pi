'use strict';

const Constants = require('./constants');
const Process = require('./process');
const Name = require('./name');

class Summation extends Process {
  static SUM() {
    return '+';
  }
  constructor(lhs, rhs) {
    super();
    if (!lhs || !rhs) {
      throw new Error('Missing arguments for Summation constructor');
    }
    if (!(lhs instanceof Process) || !(rhs instanceof Process)) {
      throw new Error('Summation constructor requires processes');
    }
    this.lhs = lhs;
    this.rhs = rhs;
  }
  print() {
    return `(${this.lhs.print()}${Constants.SPACE}${Summation.SUM()}${Constants.SPACE}${this.rhs.print()})`;
  }
  static parse(string, parser) {
    if (!string || !parser) {
      return Constants.DOES_NOT_PARSE;
    }
    const split = string.split(Summation.SUM());
    if (split.length === 1) {
      return Constants.DOES_NOT_PARSE;
    }
    const lhs = parser(split[0]);
    if (lhs === Constants.DOES_NOT_PARSE) {
      return Constants.DOES_NOT_PARSE;
    }
    const rhs = parser(split.slice(1).join(Summation.SUM()));
    if (rhs === Constants.DOES_NOT_PARSE) {
      return Constants.DOES_NOT_PARSE;
    }
    return new Summation(lhs, rhs);
  }
  n() {
    return Name.uniqueSet([...this.lhs.n(), ...this.rhs.n()]);
  }
  fn() {
    return Name.uniqueSet([...this.lhs.fn(), ...this.rhs.fn()]);
  }
  bn() {
    return Name.uniqueSet([...this.lhs.bn(), ...this.rhs.bn()]);
  }
  toGraph(id) {
    const lhs = this.lhs.toGraph(id + 1);
    const greatest = Process.greatestIndex(lhs.nodes.map(x => x.id));
    const rhs = this.rhs.toGraph(greatest + 1);
    return {
      nodes: [{
        id, 
        label: Summation.SUM(),
        title: 'Summation',
      }].concat(lhs.nodes).concat(rhs.nodes),
      edges: [{
        from: id,
        to: id + 1
      }, {
        from: id,
        to: greatest + 1,
      }].concat(lhs.edges).concat(rhs.edges),
    };
  }
}

module.exports = Summation;