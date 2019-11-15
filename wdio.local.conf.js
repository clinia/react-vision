/* eslint-disable import/no-commonjs */

const { local } = require('instantsearch-e2e-tests');

exports.config = {
  ...local,
  before: function() {
    require('@babel/register');
  },
  // specs: ['./examples/default/__tests__/e2e/specs/**/*.js'],
  specs: ['./e2e/e2e-tests/__tests__/specs/**/*.js'],
};
