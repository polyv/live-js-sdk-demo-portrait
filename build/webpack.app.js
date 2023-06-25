/**
 * @file 用来生产构建 example
 */

const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.base.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(common, {
  mode: 'production',
  entry: {
    index: './example/dist.js'
  },
  output: {
    path: path.resolve(__dirname, '../.dist'),
    publicPath: './',
    filename: 'polyv-portrait-watch.min.js',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './example/index.html',
      inject: true
    }),
    new MiniCssExtractPlugin({
      filename: '/polyv-portrait-watch.min.css'
    }),
  ],
});
