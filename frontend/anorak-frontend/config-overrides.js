const webpack = require('webpack');

module.exports = function override(config, env) {
  // Add polyfills for Node.js core modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    assert: require.resolve('assert'),
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    os: require.resolve('os-browserify/browser'),
    url: require.resolve('url'),
    buffer: require.resolve('buffer'),
    process: require.resolve('process/browser'),
    path: require.resolve('path-browserify'), // Ensure this line is included
    util: require.resolve('util'),
    vm: require.resolve('vm-browserify'),
	zlib: require.resolve('browserify-zlib'), // Add this line
  };

  // Provide global variables
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ]);

  // Suppress source map warnings from node_modules
  if (!config.ignoreWarnings) {
    config.ignoreWarnings = [];
  }
  config.ignoreWarnings.push(/Failed to parse source map/);

  return config;
};
