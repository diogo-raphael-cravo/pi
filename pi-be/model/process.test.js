'use strict';

const Process = require('./Process');

test('Returns greatest index', () => {
  expect(Process.greatestIndex([3, 5, 2])).toBe(5);
});