const path = require('path');

const config = {
  mode: 'development',
  devtool: 'source-map',

  entry: './game/js/app.js',

  resolve: {
    extensions: ['.js']
  },

  output: {
    path: path.join(__dirname, 'game'),
    filename: 'bundle.js'
  },

  module: {
    rules: [
      {
        test: /.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  }
};

module.exports = config;