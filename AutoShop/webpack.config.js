const path = require('path');
module.exports = {
  mode: 'development',
  entry: ['babel-polyfill','./index.ts'],
  //entry: './index.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx$/,
        use: 'babel-loader',
        exclude: /(node_modules|bower_components)/
      },
      {
        test: /\.ts$/,
        use: 'babel-loader',
        exclude: /(node_modules|bower_components)/
      },
      {
        test: /\.m?js?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader:'babel-loader',
          options: {
            presets:["@babel/preset-env"],
            plugins:["@babel/plugin-transform-runtime"],
            cacheDirectory: true
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader','css-loader'],
        exclude: /(node_modules|bower_components)/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: path.join(__dirname,"./dist"),
    compress: true
  }
};