const merge = require('webpack-merge');
const common = require('./webpack.base.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  entry: {
    main: './example/dist.js'
  },
  output: {
    publicPath: '/dist/',
    filename: 'polyv-portrait-watch.min.js',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '/polyv-portrait-watch.min.css'
    }),
    new HtmlWebpackPlugin({
      template: './example/index.html',
      inject: true
    })
  ]
});
