const merge = require('webpack-merge');
const common = require('./webpack.base.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(common, {
  mode: 'production',
  entry: {
    main: './src/index.js'
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
  ]
});
