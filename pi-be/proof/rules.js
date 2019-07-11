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