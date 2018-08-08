const merge = require('webpack-merge')
const nodeExternals = require('webpack-node-externals')
const baseConfig = require('./webpack.base.config.js')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

module.exports = merge(baseConfig, {
  // 将entry指向应用程序的server入口文件
  entry: '../src/entry-server.js',
  // 允许webpack以Node适用方式处理动态导入
  target: 'node',
  // 对bundle renderer提供source map支持
  devtool: 'source-map',
  // 使用node风格导出模块
  output: {
    libraryTarget: 'commonjs2'
  },
  // 外置化应用程序依赖模块
  externals: nodeExternals({
    whitelist: /\.css$/
  }),
  // 将服务器的整个输出构建为单个JSON文件的插件，默认文件名为`vue-ssr-server-bundle.js`
  plugins: [
    new VueSSRServerPlugin()
  ]
})