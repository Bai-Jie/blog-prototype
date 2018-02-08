const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: {
    bundle: './src/index.js',
    setup_database: './src/setup_database.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build', 'dist')
  },
  target: 'node',
  externals: [nodeExternals()],
};
