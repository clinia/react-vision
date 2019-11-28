/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable import/no-commonjs */
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
