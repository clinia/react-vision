/* eslint-disable import/no-commonjs */

const { local } = require('vision-e2e-tests');

exports.config = {
  ...local,
  before: function() {
    require('@babel/register');
  },
  specs: ['./examples/default/__tests__/e2e/specs/**/*.js'],
};
