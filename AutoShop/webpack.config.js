const path = require('path');

module.exports = {
  mode: 'development',
  //entry: ['babel-polyfill','./src/service.ts'],
  entry: './src/servis.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {loader:'babel-loader',
          options: {
            present:["@babel/present-env"]
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader','css-loader']
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