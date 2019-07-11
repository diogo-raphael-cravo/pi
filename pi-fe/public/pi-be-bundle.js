(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.pi = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

const Constants = require('./model/constants');
const Parser = require('./model/parser');
const Rules = require('./proof/rules');

module.exports = {
  Constants,
  Parser,
  Rules,
};
},{"./model/constants":3,"./model/parser":8,"./proof/rules":17}],2:[function(require,module,exports){
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
  toGraph(id) {
    const lhs = this.lhs.toGraph(id + 1);
    const greatest = Process.greatestIndex(lhs.nodes.map(x => x.id));
    const rhs = this.rhs.toGraph(greatest + 1);
    return {
      nodes: [{
        id, 
        label: Composition.COMPOSITION(),
        title: 'Composition',
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

module.exports = Composition;
},{"./constants":3,"./name":6,"./process":11}],3:[function(require,module,exports){
'use strict';

module.exports = {};
module.exports.UNICODE_OVERLINE = '\u0305';
module.exports.UNICODE_TAU = '\u03C4';
module.exports.SPACE = ' ';
module.exports.NAME_SYMBOLS = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('');
module.exports.DOES_NOT_PARSE = null;
module.exports.OPEN_PARENTHESIS = '{';
module.exports.CLOSE_PARENTHESIS = '}';
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
  toGraph(id) {
    return {
      nodes: [{
        id, 
        label: Inaction.INACTION(),
        title: 'Inaction',
      }],
      edges: [],
    };
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
  toGraph(id) {
    const proc = this.process.toGraph(id + 1);
    return {
      nodes: [{
        id, 
        label: `[${this.lhs.print()}=${this.rhs.print()}]`,
        title: 'Match prefix',
      }].concat(proc.nodes),
      edges: [{
        from: id,
        to: id + 1,
      }].concat(proc.edges),
    };
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
  toGraph() {
    return {
      nodes: [],
      edges: [],
    };
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
  toGraph(id) {
    const proc = this.process.toGraph(id + 1);
    return {
      nodes: [{
        id, 
        label: `${this.channel.print()}${Constants.UNICODE_OVERLINE}${this.subject.print()}`,
        title: 'Negative prefix',
      }].concat(proc.nodes),
      edges: [{
        from: id,
        to: id + 1,
      }].concat(proc.edges),
    };
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
  toGraph(id) {
    const proc = this.process.toGraph(id + 1);
    return {
      nodes: [{
        id, 
        label: `${this.channel.print()}(${this.subject.print()})`,
        title: 'Positive prefix',
      }].concat(proc.nodes),
      edges: [{
        from: id,
        to: id + 1,
      }].concat(proc.edges),
    };
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
},{"./constants":3}],12:[function(require,module,exports){
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
  toGraph(id) {
    const proc = this.process.toGraph(id + 1);
    return {
      nodes: [{
        id, 
        label: `${Replication.REPLICATION()}`,
        title: 'Replication',
      }].concat(proc.nodes),
      edges: [{
        from: id,
        to: id + 1,
      }].concat(proc.edges),
    };
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
  toGraph(id) {
    const proc = this.process.toGraph(id + 1);
    return {
      nodes: [{
        id, 
        label: `${UNICODE_TAU}`,
        title: 'Silent prefix',
      }].concat(proc.nodes),
      edges: [{
        from: id,
        to: id + 1,
      }].concat(proc.edges),
    };
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
},{"./constants":3,"./name":6,"./process":11}],16:[function(require,module,exports){
'use strict';

class Rule {
	constructor(lhs, rhs) {
		this.lhs = lhs;
		this.rhs = rhs;
	}
}

module.exports = Rule;
},{}],17:[function(require,module,exports){
'use strict';

const SCReflRule = require('./sc-refl-rule');
const SCMatRule = require('./sc-mat-rule');
const SCSumAssocRule = require('./sc-sum-assoc-rule');

module.exports = {
  congruence: [
    SCReflRule,
  ],
  structuralCongruence: [
    SCMatRule,
    SCSumAssocRule,
  ],
  reduction: [],
};
},{"./sc-mat-rule":18,"./sc-refl-rule":19,"./sc-sum-assoc-rule":20}],18:[function(require,module,exports){
'use strict';

const Rule = require('./rule');
const MatchPrefix = require('../model/match-prefix');

class SCMatRule extends Rule {
	static NAME() {
		return 'SC-MAT';
	}
	static forward(lhs) {
		if (!(lhs instanceof MatchPrefix)) {
			throw new Error('SCMatRule FW lhs must be an instance of MatchPrefix');
		}
		if (!lhs.lhs.equals(lhs.rhs)) {
			throw new Error('SCMatRule FW lhs names must be the same');
		}
		return new SCMatRule(lhs, lhs.process);
	}
	static backward(name, rhs) {
		return new SCMatRule(new MatchPrefix(name, name, rhs), rhs);
	}
}

module.exports = SCMatRule;
},{"../model/match-prefix":5,"./rule":16}],19:[function(require,module,exports){
'use strict';

const Rule = require('./rule');
const Process = require('../model/process');

class SCReflRule extends Rule {
  static NAME() {
    return 'SC-REFL';
  }
  static forward(lhs) {
    if (!(lhs instanceof Process)) {
      throw new Error('SCReflRule FW lhs must be an instance of Process');
    }
    return new SCReflRule(lhs, lhs);
  }
  static backward(rhs) {
    return SCReflRule.forward(rhs);
  }
}

module.exports = SCReflRule;
},{"../model/process":11,"./rule":16}],20:[function(require,module,exports){
'use strict';

const Rule = require('./rule');
const Summation = require('../model/summation');

class SCSumAssoc extends Rule {
	static NAME() {
		return 'SC-SUM-ASSOC';
	}
	static forward(process) {
		if (!(process instanceof Summation)) {
			throw new Error('SCSumAssoc FW process must be an instance of Summation');
		}
		if (!(process.rhs instanceof Summation)) {
			throw new Error('SCSumAssoc FW rhs must be an instance of Summation');
		}
		return new SCSumAssoc(process, 
			new Summation(new Summation(process.lhs, process.rhs.lhs), process.rhs.rhs));
	}
	static backward(name, rhs) {
		return new SCMatRule(new MatchPrefix(name, name, rhs), rhs);
	}
}

module.exports = SCSumAssoc;
},{"../model/summation":15,"./rule":16}]},{},[1])(1)
});
