const path = require('path');
const { webpack } = require('webpack');

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: 'inline-source-map',
  // Polyfills for node modules
  resolve: {
    fallback: {
        "buffer": require.resolve("buffer/"),
        "fs": false,
        "stream": require.resolve("stream-browserify"),
        "timers": require.resolve("timers-browserify"),
    },
    alias: {
      "process": "process/browser",
    }
  },
};