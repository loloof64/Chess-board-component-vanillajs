const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: './src/ChessBoardComponent.js',
    output: {
        filename: 'ChessBoardComponent.min.js',
        path: __dirname + '/dist',
    },
    optimization: {
        minimizer: [new UglifyJsPlugin()],
    },
    module: {
        rules: [
          {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env']
              }
            }
          }
        ]
      }
};