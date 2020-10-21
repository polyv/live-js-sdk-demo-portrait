const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isDev = process.env.NODE_ENV !== 'production';

module.exports = {
  mode: 'none',
  resolve: {
    alias: {
      '@utils': path.resolve(__dirname, '../node_modules/@polyv/utils/src'),
    },
    extensions: ['.js', '.css', '.vue'],
    modules: ['node_modules'],
  },
  performance: {
    // 入口起点的最大体积
    maxEntrypointSize: 50000000,
    // 生成文件的最大体积
    maxAssetSize: 30000000,
  },
  module: {
    rules: [{
      test: /\.m?js$/,
      exclude: [
        path.resolve(__dirname, '../node_modules')
      ],
      loader: 'babel-loader',
    },
    {
      enforce: 'pre',
      test: /\.(m?js|vue)$/,
      exclude: [
        path.resolve(__dirname, '../node_modules')
      ],
      loader: 'eslint-loader'
    },
    {
      test: /\.vue$/,
      use: [{
        loader: 'vue-loader'
      }]
    },
    {
      test: /\.(sa|sc|c)ss$/,
      use: [
        isDev ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
        'css-loader',
        'postcss-loader',
      ]
    },
    {
      test: /\.(png|svg|jpg|gif)$/,
      use: [{
        loader: 'url-loader',
        options: {
          esModule: false,
          limit: 400000
        }
      }]
    },
    {
      test: /\.(svg|otf|ttf|woff2?|eot)(\?\S*)?$/,
      use: [{
        loader: 'url-loader',
        options: {
          esModule: false,
          limit: 400000
        }
      }]
    }]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
};
