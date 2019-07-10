'use strict';

const SCReflRule = require('./sc-refl-rule');
const SCMatRule = require('./sc-mat-rule');
const SCSumAssocRule = require('./sc-sum-assoc-rule');

module.exports = [
  SCReflRule,
  SCMatRule,
  SCSumAssocRule,
];