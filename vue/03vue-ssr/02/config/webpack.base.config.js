const ExtractTextPlugin = require('extract-text-webpack-plugin')

// CSS提取应该只用于生产环境，这样我们在开发过程中仍然可以热重载
const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  module: {
    rules: [
      {
        test: /.vue$/,
        loader: 'vue-loader',
        options: {
          extractCSS: isProduction
        }
      },
      {
        test: /\.css$/,
        // 重要： 使用vue-style-loader 替代 style-loader
        use: isProduction
          ? ExtractTextPlugin.extract({
            use: 'css-loader',
            fallback: 'vue-style-loader'
          })
          : ['vue-style-loader', 'css-loader']
      }
    ]
  },
  plugins: 
          /*
          isProduction 
          // 确保添加了此插件
          ? [new ExtractTextPlugin({ filename: 'common.[chunkhash].css'})]
          : [] */
          [
            // 将依赖模块提取到vendor chunk以获得更好的缓存
            new webpack.optimize.CommonsChunkPlugin({
              name: 'vendor',
              minChunks: function (module) {
                return (
                  // 如果它在node_modules中
                  /node_modules/.test(module.context) && 
                  !/\.css$/.test(module.request)
                )
              }
            }),
            // 提取webpack运行时和mainifest
            new webpack.optimize.CommonsChunkPlugin({
              name: 'mainfest'
            })
          ]
}