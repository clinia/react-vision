/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable import/no-commonjs */

module.exports = {
  reporters: ['default', 'jest-junit'],
  roots: ['<rootDir>/packages'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
};
