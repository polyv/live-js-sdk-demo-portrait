const merge = require('webpack-merge');
const common = require('./webpack.base.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const getSign = require('./getSign.js');

module.exports = merge(common, {
  mode: 'development',
  entry: {
    index: './example/index.js'
  },
  devServer: {
    host: '0.0.0.0',
    port: 15018,
    disableHostCheck: true,
    overlay: true,
    before: function(app) {
      app.get('/getSign', (req, res) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'application/json;charset=utf8');
        res.send(getSign(req.query));
      });
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './example/index.html',
      inject: true
    })
  ],
});
