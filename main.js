'use strict';

/************************************
 * Syntax
 ************************************/

function n(proc) {
  if (proc instanceof Process) {
    return proc.n();
  }
}
function fn(proc) {
  if (proc instanceof Process) {
    return proc.fn();
  }
}
function bn(proc) {
  if (proc instanceof Process) {
    return proc.bn();
  }
}

module.exports = {
  Parser,
};