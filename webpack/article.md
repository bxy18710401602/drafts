​	写一个功能简单的vue脚手架，用于演示一些vue代码。这个脚手架只是用于演示vue代码效果。以下内容记录下写代码的过程。

​	使用的工具：

```
Node v10.8.0
```



一、初始化

   	1.1 创建一个文件目录，名字为项目名称并进入文件目录

```shell
mkdir 00-vue-small-cli && cd 00-vue-small-cli
```

 	 1.2 初始化项目

```shell
npm init -y
```

此命令会在当前目录下创建一个package.json文件，-y的意思是所有问题都默认是yes，跳过了提问环节。后续可以直接在package.json文件里面修改内容。

二、 Vue

​	2.1 安装vue

​	在命令行执行以下命令：

```shell
npm i vue -E  
```

​	其中`i`是`install`的简写，`-E`是`--save-exact`的简写。`--save`表示将安装包的信息保存在package.json文件中的`"dependencies"`下，`npm install`默认安装的包的版本记录在package.json中是一个范围，`-exact`表示在package.json中保存一个具体的版本号。安装好后会在package.json中发现多了以下内容：

```json
  "dependencies": {
    "vue": "2.5.17"
  }
```

​	我试了一下，在`cnpm`下使用`-exact`不能生效。

​      **如果下载速度过慢的话就用`cnpm i vue --save`**。

​	2.2 在根目录下创建如下文件

```shell
 |- index.html
 |- /src
   |- index.js
```

​	index.html是单页面应用的入口文件，src中的index.js作为vue实例的入口文件。在index.html中写上：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8"/>
    <title>vue-small-cli</title>
  </head>
  <body>
    <script src="./src/index.js"></script>
  </body>
</html>
```

​	2.3 调整package.json文件

​	    将文件中的`"main": "index.js"`去掉，添加上一行`"private": true`，这是为了确保我们的包是私有的，防止代码被意外发布。

三、 webpack 

​	目前为止浏览器中的页面普遍是.html文件，样式文件是.css，要实现页面的功能需要使用JavaScript。所以要让vue中的.vue文件能够在浏览器中正常执行，我们需要将它们解析为浏览器能够识别的.html，.css，.js文件，这就需要用到打包工具webpack。

​	简单了解一下webpack的一些基本概念：

>entry：入口文件配置。
>
>output：输出文件配置。
>
>loaders：配置除JavaScript和JSON以外的文件的处理。
>
>plugins：配置要用的插件。
>
>mode：模式设置，用于启用相应的webpack内置优化。

3.1 安装webpack

```shell
npm i webpack webpack-cli -D -E
```

 	`-D`是`--save-dev`命令的简写，`-dev`表示安装的依赖只在开发时使用，会将安装的包的信息放到`devDependencies`中。

​	**下载速度太慢的话，就用`cnpm i webpack webpack-cli --save-dev `**

3.2 为了测试webpack是否生效，在src/index.js文件中写上代码:

```javascript
function component () {
  let element = document.createElement('h1')
  element.textContent = '测试Webpack'
  return element
}

document.body.appendChild(component())
```

在根目录创建一个dist文件夹，里面放index.html文件，此index.html文件的内容是：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8"/>
    <title>vue-small-cli</title>
  </head>
  <body>
    <script src="main.js"></script>
  </body>
</html>
```

3.3 创建一个文件：webpack.config.js（当执行webpack命令的时候，默认会去找这个文件，如果要用别的名字需要另行配置）。

文件内容如下：

```javascript
const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  }
}
```

3.4 在package.json文件中的`scripts`下增加一行`"build": "webpack"`，这样设置后当执行`npm run build`，就相当于执行命令`npx webpack --config webpack.config.js`

​	  执行了`npm run build`之后，可以看见dist文件夹下面多了一个main.js文件，打开dist文件夹下的index.html文件能观察到正常的有“测试Webpack”这几个字的效果，就说明打包成功了。

​	我现在是先把html文件写在dist文件夹中的，上面webpack配置只是简单打包了js文件，现在添加上loaders，让webpack能够处理.vue文件，.css文件、图片文件、.vue文件中使用的style以及ES6语法、less语法。再添加合适的plugins。webpack在打包的过程中生成一个dist文件夹，dist文件夹中就是打包好的完整的项目。

​       3.4.1 需要安装的依赖：

```shell
npm i html-webpack-plugin -D -E
npm i clean-webpack-plugin -D -E
npm i style-loader css-loader -D -E
npm i file-loader -D -E
npm i csv-loader xml-loader -D -E
npm i webpack-dev-server -D -E
```

​      3.4.2 修改之后的webpack.config.js文件是这样的：

```javascript
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin') // 使用之后webpack只打包用到的文件
const CleanWebpackPlugin = require('clean-webpack-plugin') // 用于生成index.html文件

module.exports = {
  entry: {
    app: './src/index.js'
  },
  devtool: 'inline-source-map', // 指出错误来源
  devServer: { // 提供一个简单的服务器
    contentBase: './dist'
  },
  plugins: [
    new CleanWebpackPlugin(['dist']), 
    new HtmlWebpackPlugin({   
      title: 'vue-small-cli'
    }),
    new webpack.HotModuleReplacementPlugin() // 实现热加载
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  mode: 'development', // 指明开发模式后，文件不会被压缩（默认是production）
  module: {
    rules: [
      {
        test: /.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(csv|tsv)$/,
        use: [
          'csv-loader'
        ]
      },
      {
        test: /.xml$/,
        use: [
          'xml-loader'
        ]
      }
    ]
  }
}
```

​     3.4.3 在package.json文件中的`scripts`下添加：

```shell
"watch": "webpack --watch", 
"start": "webpack-dev-server --open"
```

​	这样一来，直接在命令行运行`npm run watch`，当文件内容改变的时候，webpack就会自动打包文件。在命令行运行`npm start`，浏览器就会自动加载页面，当文件的内容改变的时候，页面也能自动重载。

​    再在`“name”`所在的层级添加：` "sideEffects": false,`，这样设置是为了让webpack安全地去除没有使用的exports。

  3.4.4 工程化

​	之前的webpack配置都是写在webpack.config.js里面的，现在将它们区分开来。

首先安装webpack-merge，用于合并配置：

```shell
npm i webpack-merge -D -E
```

​      创建一个build文件夹，在其中创建三个文件`webpack.common.js`、`webpack.dev.js`、`webpack.prod.js`分别表示webpack基本配置，开发模式配置和生产模式配置。

将`webpack.config.js`中的内容放到三个文件中（之后删掉`webpack.config.js`文件）：

`webpack.common.js`：

```javascript
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin') // 使用之后webpack只打包用到的文件
const CleanWebpackPlugin = require('clean-webpack-plugin') // 用于生成index.html文件

module.exports = {
  entry: {
    app: path.resolve(__dirname, '../src/index.js')
  },
  plugins: [
    new CleanWebpackPlugin([path.resolve(__dirname, '../dist')]), 
    new HtmlWebpackPlugin({   
      title: 'vue-small-cli'
    }),
    new webpack.HotModuleReplacementPlugin(), // 实现热加载
    new webpack.HashedModuleIdsPlugin() // 用于只重新打包修改过的文件
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '../dist')
  },
  optimization: { // 打包优化
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vender: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(csv|tsv)$/,
        use: [
          'csv-loader'
        ]
      },
      {
        test: /.xml$/,
        use: [
          'xml-loader'
        ]
      }
    ]
  }
}
```

`webpack.dev.js`:

```javascript
const path = require('path')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'development', // 指明开发模式后，文件不会被压缩（默认是production）
  devtool: 'inline-source-map', // 指出错误来源
  devServer: { // 提供一个简单的服务器
    contentBase: path.resolve(__dirname, '../dist')
  }
})
```

`webpack.prod.js`:

```javascript
const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'production'
})
```

在`package.json`文件中的scripts下修改start和build的值：

```shell
"start": "webpack-dev-server --open --config build/webpack.dev.js ",
"build": "webpack --config build/webpack.prod.js"
```

因为我们是在每次开发之后才打包的，`watch`的作用不大，先去掉watch。
3.5 配置NODE_ENV
首先安装依赖：
```
npm i cross-env -D -E
```
然后再修改package.json文件中的start和build部分如下：
```shell
"start": "cross-env NODE_ENV=development webpack-dev-server --open --config build/webpack.dev.js ",
"build": "cross-env NODE_ENV=production webpack --config build/webpack.prod.js"
```
这样，在
四、babel

 要使代码中的使用的ECMASCRIPT6语法转换为ECMASCRIPT5语法，需要使用babel。

首先安装babel相关的依赖：

```shell
npm i @babel/core @babel/preset-env babel-loader -D -E
```

在项目的根目录下创建一个文件`.babelrc`，填写以下内容：

```json
{
  "presets": ["@babel/preset-env"]
}
```
五、代码标准化

src目录下的文件改成这样了：

```
└── src
    ├── App.vue
    └── main.js
```

5.1 安装依赖：

```shell
npm i eslint eslint-loader -D -E
```
按照官网的步骤设置配置文件

5.2 初始化

```shell
./node_modules/.bin/eslint --init
```

初始化会问一些问题，我的选择是这样的：

```shell
? How would you like to configure ESLint? Use a popular style guide
? Which style guide do you want to follow? Airbnb (https://github.com/airbnb/javascript)
? Do you use React? No
? What format do you want your config file to be in? JavaScript
Checking peerDependencies of eslint-config-airbnb-base@latest
The config that you've selected requires the following dependencies:

eslint-config-airbnb-base@latest eslint@^4.19.1 || ^5.3.0 eslint-plugin-import@^2.14.0
? Would you like to install them now with npm? Yes
```

这样就生成了一个.eslintrc.js文件

5.3 执行配置的文件

```shell
./node_modules/.bin/eslint .eslintrc.js
```

这个时候给出一个警告：

```shell
File ignored by default.  Use a negated ignore pattern (like "--ignore-pattern '!<relative/path/to/filename>'") to override
```

根据提示，执行命令：

```shell
./node_modules/.bin/eslint .eslintrc.js --ignore-pattern '!.eslintrc.js'
```

报了6个错，根据提示，执行命令：

```shell
./node_modules/.bin/eslint .eslintrc.js --ignore-pattern '!.eslintrc.js' --fix
```

就将文件中的错误都修理好了。

现在当执行npm start的时候，就会eslint-loader就会处理eslint配置文件。

出现了报错，要纠正eslint检查出来的错误，使用

```shell
./node_modules/.bin/eslint ./src/ --fix
```

这条语句将检查出来的src文件夹中能改的错误都改了，还剩下两个错误：

```shell
  2:17  error  Unable to resolve path to module './App'  import/no-unresolved
  4:1   error  Do not use 'new' for side effects         no-new
```

我要已经在webpack中设置了.vue的文件为能解析的，所以第一个错是不存在的，第二个错是说new在使用的时候不能带副作用。所以这里要忽略一些检查内容。在.vue中添加了内容之后，发现'airbnb-base'并不能正确地检查vue文件。所以这些也要另行配置。

在[eslint演示](https://cn.eslint.org/demo/)这个地址选择需要检查的部分生成了一个配置文件，就用这个配置文件了。最后调半天还是直接使用了vue-cli中的eslintrc.js。

5.4 创建一个.eslintignore文件，设置忽略eslint检查的路径，直接使用了vue-cli中忽略的文件路径。

```shell
/build/
/config/
/dist/
/*.js
```



六、设置git提交代码时忽略的文件
这里我直接用了vue-cli中的.gitignore

```shell
.DS_Store
node_modules/
/dist/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Editor directories and files
.idea
.vscode
*.suo
*.ntvs*
*.njsproj
*.sln
```
七、设置编辑器的格式

创建一个.editorconfig文件，也是直接使用了vue-cli中的.editorconfig文件的内容：

```shell
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
```



八、接下来的步骤都参考地址8[vue-loader是什么](https://vue-loader.vuejs.org/zh/#vue-loader-%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F)。然后东改西改地完成了。

参考地址：

1. npm官方文档：[中](https://www.npmjs.com.cn/)、[英](https://docs.npmjs.com/)。
2. [vue官网工具部分](https://cn.vuejs.org/v2/guide/deployment.html)。
3. webpack官方文档：[中](https://www.webpackjs.com/concepts/)、 [英](https://webpack.js.org/concepts/)。
4. webpack官方指南：[中](https://www.webpackjs.com/guides/getting-started/)、[英](https://webpack.js.org/guides/getting-started/#using-a-configuration)。
5. [babel官网](https://babeljs.io/docs/en/usage)。[babel的webpack配置](https://babeljs.io/setup#installation)。
6. eslint官方文档：[中](https://cn.eslint.org/docs/user-guide/configuring)、 [英](https://eslint.org/docs/user-guide/getting-started)。
7. [使用eslint-loader](https://www.npmjs.com/package/eslint-loader)。
8. [vue-loader是什么](https://vue-loader.vuejs.org/zh/#vue-loader-%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F)。