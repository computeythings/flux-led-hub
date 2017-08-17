module.exports = {
  entry: './src/public/client.js',
  output: {
    filename: 'bundle.js',
    path: __dirname + '/src/public'
  },
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react']
        }
      }
    ]
  }
}
