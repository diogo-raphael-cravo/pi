'use strict';

const Constants = require('./constants');
const Process = require('./process');
const Name = require('./name');

class Restriction extends Process {
  constructor(variable, proc) {
    super();
    if (!variable || !proc) {
      throw new Error('Missing arguments for Restriction constructor');
    }
    if (!(variable instanceof Name) || !(proc instanceof Process)) {
      throw new Error('Restriction constructor requires a name and a process');
    }
    this.variable = variable;
    this.process = proc;
  }
  print() {
    return `(${this.variable.print()})${this.process.print()}`;
  }
  static parse(string, parser) {
    if (!string || !parser) {
      return Constants.DOES_NOT_PARSE;
    }
    if (!string.startsWith('(')) {
      return Constants.DOES_NOT_PARSE;
    }
    const split = string.substr(1).split(')');
    if (split.length === 1) {
      return Constants.DOES_NOT_PARSE;
    }
    const name = Name.parse(split[0]);
    if (name === Constants.DOES_NOT_PARSE) {
      return Constants.DOES_NOT_PARSE;
    }
    const proc = parser(split.slice(1).join(')'));
    if (proc === Constants.DOES_NOT_PARSE) {
      return Constants.DOES_NOT_PARSE;
    }
    return new Restriction(name, proc);
  }
  n() {
    return Name.uniqueSet([...this.process.n()].concat([this.variable]));
  }
  fn() {
    return Name.uniqueSet([...this.process.fn()]
      .filter(i => !i.equals(this.variable)));
  }
  bn() {
    return Name.uniqueSet([...this.process.bn(), this.variable]);
  }
  toGraph(id) {
    const proc = this.process.toGraph(id + 1);
    return {
      nodes: [{
        id, 
        label: `(${this.variable.print()})`,
        title: 'Restriction',
      }].concat(proc.nodes),
      edges: [{
        from: id,
        to: id + 1,
      }].concat(proc.edges),
    };
  }
}

module.exports = Restriction;