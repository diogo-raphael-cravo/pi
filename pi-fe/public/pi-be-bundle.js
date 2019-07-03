(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.pi = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

const Constants = require('./model/constants');
const Parser = require('./model/parser');

module.exports = {
  Constants,
  Parser,
};
},{"./model/constants":3,"./model/parser":8}],2:[function(require,module,exports){
'use strict';

const Constants = require('./constants');
const Process = require('./process');
const Name = require('./name');

class Composition extends Process {
  static COMPOSITION() {
    return '|';
  }
  constructor(lhs, rhs) {
    super();
    if (!lhs || !rhs) {
      throw new Error('Missing arguments for Composition constructor');
    }
    if (!(lhs instanceof Process) || !(rhs instanceof Process)) {
      throw new Error('Composition constructor requires processes');
    }
    this.lhs = lhs;
    this.rhs = rhs;
  }
  print() {
    return `(${this.lhs.print()}${Constants.SPACE}${Composition.COMPOSITION()}${Constants.SPACE}${this.rhs.print()})`;
  }
  static parse(string, parser) {
    if (!string || !parser) {
      return Constants.DOES_NOT_PARSE;
    }
    const split = string.split(Composition.COMPOSITION());
    if (split.length === 1) {
      return Constants.DOES_NOT_PARSE;
    }
    const lhs = parser(split[0]);
    if (lhs === Constants.DOES_NOT_PARSE) {
      return Constants.DOES_NOT_PARSE;
    }
    const rhs = parser(split.slice(1).join(Composition.COMPOSITION()));
    if (rhs === Constants.DOES_NOT_PARSE) {
      return Constants.DOES_NOT_PARSE;
    }
    return new Composition(lhs, rhs);
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
}

module.exports = Composition;
},{"./constants":3,"./name":6,"./process":11}],3:[function(require,module,exports){
'use strict';

module.exports = {};
module.exports.UNICODE_OVERLINE = '\u0305';
module.exports.UNICODE_TAU = '\u03C4';
module.exports.SPACE = ' ';
module.exports.NAME_SYMBOLS = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('');
module.exports.DOES_NOT_PARSE = null;
},{}],4:[function(require,module,exports){
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
  n() {
    return new Set([]);
  }
  fn() {
    return new Set([]);
  }
  bn() {
    return new Set([]);
  }
}

module.exports = Inaction;
},{"./constants":3,"./process":11}],5:[function(require,module,exports){
'use strict';

const Constants = require('./constants');
const Process = require('./process');
const Name = require('./name');
const Prefix = require('./prefix');

class MatchPrefix extends Prefix {
  constructor(lhs, rhs, proc) {
    super();
    if (!lhs || !rhs || !proc) {
      throw new Error('Missing arguments for MatchPrefix constructor');
    }
    if (!(lhs instanceof Name) || !(rhs instanceof Name) || !(proc instanceof Process)) {
      throw new Error('MatchPrefix constructor requires two names and a process');
    }
    this.lhs = lhs;
    this.rhs = rhs;
    this.process = proc;
  }
  print() {
    return `[${this.lhs.print()}=${this.rhs.print()}]${Prefix.PREFIX_DELIMITER()}${this.process.print()}`;
  }
  static parse(string, parser) {
    if (!string || !parser) {
      return Constants.DOES_NOT_PARSE;
    }
    const split = string.split(Prefix.PREFIX_DELIMITER());
    if (split.length === 1) {
      return Constants.DOES_NOT_PARSE;
    }
    const prefix = split[0];
    if (!prefix.startsWith('[') || !prefix.endsWith(']')) {
      return Constants.DOES_NOT_PARSE;
    }
    const trimmedPrefix = prefix.substr(0, prefix.length - 1).substr(1);
    const names = trimmedPrefix.split('=');
    if (names.length !== 2) {
      return Constants.DOES_NOT_PARSE;
    }
    const lhs = Name.parse(names[0]);
    const rhs = Name.parse(names[1]);
    if (lhs === Constants.DOES_NOT_PARSE || rhs === Constants.DOES_NOT_PARSE) {
      return Constants.DOES_NOT_PARSE;
    }

    const proc = parser(split.slice(1).join(Prefix.PREFIX_DELIMITER()));
    if (proc === Constants.DOES_NOT_PARSE) {
      return Constants.DOES_NOT_PARSE;
    }
    return new MatchPrefix(lhs, rhs, proc);
  }
  n() {
    return Name.uniqueSet([...new Set([this.lhs, this.rhs]), ...this.process.n()]);
  }
  fn() {
    return Name.uniqueSet([...new Set([this.lhs, this.rhs]), ...this.process.fn()]);
  }
  bn() {
    return this.process.bn();
  }
}

module.exports = MatchPrefix;
},{"./constants":3,"./name":6,"./prefix":10,"./process":11}],6:[function(require,module,exports){
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
},{"./constants":3}],7:[function(require,module,exports){
'use strict';

const Constants = require('./constants');
const Process = require('./process');
const Name = require('./name');
const Prefix = require('./prefix');

class NegativePrefix extends Prefix {
  static NAME_DELIMITER() {
    return ' ';
  }
  constructor(channel, subject, proc) {
    super();
    if (!channel || !subject || !proc) {
      throw new Error('Missing arguments for NegativePrefix constructor');
    }
    if (!(channel instanceof Name) || !(subject instanceof Name) || !(proc instanceof Process)) {
      throw new Error('NegativePrefix constructor requires two names and a process');
    }
    this.channel = channel;
    this.subject = subject;
    this.process = proc;
  }
  print() {
    return `${this.channel.print()}${Constants.UNICODE_OVERLINE}${this.subject.print()}${Prefix.PREFIX_DELIMITER()}${this.process.print()}`;
  }
  static parse(string, parser) {
    if (!string || !parser) {
      return Constants.DOES_NOT_PARSE;
    }
    const split = string.split(Prefix.PREFIX_DELIMITER());
    if (split.length === 1) {
      return Constants.DOES_NOT_PARSE;
    }
    const prefix = split[0];
    const names = prefix.split(NegativePrefix.NAME_DELIMITER());
    if (names.length !== 2) {
      return Constants.DOES_NOT_PARSE;
    }
    const channel = Name.parse(names[0]);
    const subject = Name.parse(names[1]);
    if (channel === Constants.DOES_NOT_PARSE || subject === Constants.DOES_NOT_PARSE) {
      return Constants.DOES_NOT_PARSE;
    }

    const proc = parser(split.slice(1).join(Prefix.PREFIX_DELIMITER()));
    if (proc === Constants.DOES_NOT_PARSE) {
      return Constants.DOES_NOT_PARSE;
    }
    return new NegativePrefix(channel, subject, proc);
  }
  n() {
    return Name.uniqueSet([this.channel, this.subject, ...this.process.n()]);
  }
  fn() {
    return Name.uniqueSet([this.channel, this.subject, ...this.process.fn()]);
  }
  bn() {
    return this.process.bn();
  }
}

module.exports = NegativePrefix;
},{"./constants":3,"./name":6,"./prefix":10,"./process":11}],8:[function(require,module,exports){
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
},{"./composition":2,"./constants":3,"./inaction":4,"./match-prefix":5,"./negative-prefix":7,"./positive-prefix":9,"./replication":12,"./restriction":13,"./silent-prefix":14,"./summation":15}],9:[function(require,module,exports){
'use strict';

const Constants = require('./constants');
const Process = require('./process');
const Name = require('./name');
const Prefix = require('./prefix');

class PositivePrefix extends Prefix {
  constructor(channel, subject, proc) {
    super();
    if (!channel || !subject || !proc) {
      throw new Error('Missing arguments for PositivePrefix constructor');
    }
    if (!(channel instanceof Name) || !(subject instanceof Name) || !(proc instanceof Process)) {
      throw new Error('PositivePrefix constructor requires two names and a process');
    }
    this.channel = channel;
    this.subject = subject;
    this.process = proc;
  }
  print() {
    return `${this.channel.print()}(${this.subject.print()})${Prefix.PREFIX_DELIMITER()}${this.process.print()}`;
  }
  static parse(string, parser) {
    if (!string || !parser) {
      return Constants.DOES_NOT_PARSE;
    }
    const split = string.split(Prefix.PREFIX_DELIMITER());
    if (split.length === 1) {
      return Constants.DOES_NOT_PARSE;
    }
    const prefix = split[0];
    const names = prefix.split('(');
    if (names.length !== 2 || !names[1].endsWith(')')) {
      return Constants.DOES_NOT_PARSE;
    }
    const channel = Name.parse(names[0]);
    const subject = Name.parse(names[1].substr(0, names[1].length - 1));
    if (channel === Constants.DOES_NOT_PARSE || subject === Constants.DOES_NOT_PARSE) {
      return Constants.DOES_NOT_PARSE;
    }

    const proc = parser(split.slice(1).join(Prefix.PREFIX_DELIMITER()));
    if (proc === Constants.DOES_NOT_PARSE) {
      return Constants.DOES_NOT_PARSE;
    }
    return new PositivePrefix(channel, subject, proc);
  }
  n() {
    return Name.uniqueSet([this.channel, this.subject, ...this.process.n()]);
  }
  fn() {
    return Name.uniqueSet([...this.process.fn(), this.channel]
      .filter(i => !i.equals(this.subject)));
  }
  bn() {
    return Name.uniqueSet([...this.process.bn(), this.subject]
      .filter(i => !i.equals(this.channel)));
  }
}

module.exports = PositivePrefix;
},{"./constants":3,"./name":6,"./prefix":10,"./process":11}],10:[function(require,module,exports){
'use strict';

const Process = require('./process');

class Prefix extends Process {
  static PREFIX_DELIMITER() {
    return '.';
  }
}

module.exports = Prefix;
},{"./process":11}],11:[function(require,module,exports){
'use strict';

class Process {}

module.exports = Process;
},{}],12:[function(require,module,exports){
'use strict';

const Constants = require('./constants');
const Process = require('./process');

class Replication extends Process {
  static REPLICATION() {
    return '!';
  }
  constructor(proc) {
    super();
    if (!proc) {
      throw new Error('Missing arguments for Replication constructor');
    }
    if (!(proc instanceof Process)) {
      throw new Error('Replication constructor requires a process');
    }
    this.process = proc;
  }
  print() {
    return `${Replication.REPLICATION()}${this.process.print()}`;
  }
  static parse(string, parser) {
    if (!string || !parser) {
      return Constants.DOES_NOT_PARSE;
    }
    if (!string.startsWith(Replication.REPLICATION())) {
      return Constants.DOES_NOT_PARSE;
    }
    const proc = parser(string.substr(1));
    if (proc === Constants.DOES_NOT_PARSE) {
      return Constants.DOES_NOT_PARSE;
    }
    return new Replication(proc);
  }
  n() {
    return this.process.n();
  }
  fn() {
    return this.process.fn();
  }
  bn() {
    return this.process.bn();
  }
}

module.exports = Replication;
},{"./constants":3,"./process":11}],13:[function(require,module,exports){
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
}

module.exports = Restriction;
},{"./constants":3,"./name":6,"./process":11}],14:[function(require,module,exports){
'use strict';

const Constants = require('./constants');
const Process = require('./process');
const Prefix = require('./prefix');

class SilentPrefix extends Prefix {
  static TAU() {
    return 't';
  }
  constructor(proc) {
    super();
    if (!proc) {
      throw new Error('Missing arguments for SilentPrefix constructor');
    }
    if (!(proc instanceof Process)) {
      throw new Error('SilentPrefix constructor requires a process');
    }
    this.process = proc;
  }
  print() {
    return `${UNICODE_TAU}${Prefix.PREFIX_DELIMITER()}${this.process.print()}`;
  }
  static parse(string, parser) {
    if (!string || !parser) {
      return Constants.DOES_NOT_PARSE;
    }
    const split = string.split(Prefix.PREFIX_DELIMITER());
    if (split.length === 1) {
      return Constants.DOES_NOT_PARSE;
    }
    const prefix = split[0];
    if (prefix !== SilentPrefix.TAU()) {
      return Constants.DOES_NOT_PARSE;
    }

    const proc = parser(split.slice(1).join(Prefix.PREFIX_DELIMITER()));
    if (proc === Constants.DOES_NOT_PARSE) {
      return Constants.DOES_NOT_PARSE;
    }
    return new SilentPrefix(proc);
  }
  n() {
    return this.process.n();
  }
  fn() {
    return this.process.fn();
  }
  bn() {
    return this.process.bn();
  }
}

module.exports = SilentPrefix;
},{"./constants":3,"./prefix":10,"./process":11}],15:[function(require,module,exports){
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
}

module.exports = Summation;
},{"./constants":3,"./name":6,"./process":11}]},{},[1])(1)
});
