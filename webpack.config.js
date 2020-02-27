module.exports = {
    mode: 'production',
    entry: './src/ChessBoardComponent.js',
    output: {
        filename: 'ChessBoardComponent.min.js',
        path: __dirname + '/dist',
    }
};