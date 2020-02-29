const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    context: __dirname,
    mode: 'production',
    output: {
        filename: 'ChessBoardComponent.min.js',
        path: path.join(__dirname, '/dist'),
    },
    optimization: {
        minimizer: [new UglifyJsPlugin()],
    },
    module: {
        rules: [
          {
            test: /\.m?js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
            }
          }
        ]
      }
};