const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.config.js')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')

module.exports = merge(baseConfig, {
  entry: '../src/entry-client.js',
  plugins: [
    // 这将webpack运行时分离到一个引导chunk中
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    }),
    // 此插件在输出目录中生成vue-ssr-client-manifest.json
    new VueSSRClientPlugin()
  ]
})