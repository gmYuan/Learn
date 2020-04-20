# Webpack之 基础使用

### 目录

1 [预读文档](#1)

2 [基本含义](#2)

3 [安装使用](#3)

4 [常见loader使用](#4)

5 [常见plugin使用](#5)

6 [其他 基础配置](#6)


## <span id="1"> 一 预读文档 </span>

01 [webpack 官方文档](https://webpack.docschina.org/guides/)

02 [再不会webpack敲得代码就不香了](https://juejin.im/post/5de87444518825124c50cd36)

03 [带你深度解锁Webpack系列(基础篇)](https://juejin.im/post/5e5c65fc6fb9a07cd00d8838)

阅读原因: 直接参考文档


## <span id="2"> 二 基本含义 </span>

Q1: Webpack有什么 功能/作用

A:

- S1 `代码转换`：如 SCSS 编译成 CSS;

- S2 `自动刷新`: 监听本地源代码的变化，自动刷新浏览器;

- S3 `代码分割`: 提取多个页面的 公共代码;

- S4 `代码校验`: 校验代码是否符合规范

- S5 `模块合并`：把 多个模块化文件 分类合并成一个文件;

- S6 `文件优化`: 压缩代码，压缩合并图片等;

- S7 `自动发布`: 自动构建出线上发布代码


Q2: 什么是 Webpack

A:

- S1 Webpack 是一个 `模块 打包工具`，webpack中 一切文件皆模块;

- S2 它通过Loader转化文件 +  通过Plugin注入 生命周期钩子;

- S3 最后生成 由多个模块组合而成的 chunk文件


Q3: 说一说Webpakc的 核心概念有哪些

A:

- S1 Entry: Webpack构建流程的 入口文件;

- S2 Module: 模块，在Webpack里 一切皆模块，一个模块对应着一个文件,Webpack 会递归找出 所有依赖模块

- S3 Chunk: 代码块，一个 Chunk 由多个模块组合而成，用于代码合并与分割

- S4 Loader：模块转换器，用于 把非JS类型的 模块内容 按照配置 转换成新内容;

- S5 Plugin：扩展插件，在 Webpack构建流程中的 特定时机 注入扩展逻辑 来优化功能

- S6 Output: 输出结果，在 Webpack 经过一系列处理, 产生的结果

即

> S1 Webpack启动后会从 Entry的Module开始, 递归解析 Entry依赖的所有 Module;

> S2 每找到一个 Module， 就会根据配置的 Loader去找出 对应的转换规则;

> S3 对 Module进行转换后，再解析出当前 Module依赖的 Module;

> S4 这些模块会以 Entry为单位进行分组，一个 Entry 和其所有依赖的Module 被分到一个组,也就是一个 Chunk

> S5 最后Webpack 会把所有Chunk转换成 文件输出

> S6 在整个流程中 Webpack 会在恰当的时机执行 Plugin里定义的生命周期钩子




## <span id="3"> 三 安装使用 </span>

Q1: 如何安装使用 基本的Webpack配置

A:

S1 新建一个目录，初始化npm: `npm init`

S2 安装webpack: `npm install webpack webpack-cli -D`

S3 创建 webpack.config.js 文件 + 设置 entry + output:

```js
// wenpack.config.js
const path = require('path');

module.exports = {
  entry: {    // 入口文件
    main: './src/index.js',
    sub: './src/other.js'
  },

  output: {
    path: path.resolve(__dirname, 'dist'),   // 打包后的文件目录
    filename: '[name].[hash:6].js',          // 打包后的文件名称

    publicPath: '/'                         //通常是CDN地址
  },

  mode: 'development',     // 打包模式

};
```

S4 创建npm scripts命令:

```json
"scripts": {
  "build": "webpack"
}
```

## <span id="4"> 四 常见loader使用 </span>

1 解析 图片/字体 类型模块: `file-loader/url-loader`

```js
// S1 安装loader
npm install file-loader url-loader -D

//S2 配置规则 - webpack.config.js
module.exports = {
  //...
  modules: {
    rules: [
      {
        test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
        use: [
          {
            loader: 'url-loader',  
            options: {
            //资源大小 小于10K时，资源转换为base64 + 超过10K，图片拷贝到 dist目录
              limit: 10240,
              esModule: false,

              name: '[name]_[hash:6].[ext]'  //设置 文件名称
            }
          }

        ],
        exclude: /node_modules/
      }
    ]
  }
}
```

更多语法， 参考官网 [url-loader](https://webpack.docschina.org/loaders/url-loader/)


2 解析 样式类型模块: `style-loader/ css-loader/ postcss-loader/ less-loader`

```js
// S1 安装loader + loader依赖的plugins: 以less 为例
npm install style-loader css-loader postcss-loader autoprefixer -D

npm install less-loader less -D

//S2 配置规则 - webpack.config.js
module.exports = {
  //...
  modules: {
    rules: [
      {
        test: /\.(le|c)ss$/,
        use: [
          'style-loader',  // 动态创建 style标签，插入到 head中
          {
            // 处理 @import等语句, 把多个css处理成一个样式文件
            loader: 'css-loader',
            options: {
              // 让lcss里@import xx.less时，也经过下面2个loader先处理
              importLoaders: 2,
              modules: true, // 开启CSS 模块化功能(类似于 scoped)
            }
          },

          {
            loader: 'postcss-loader',
            options: {
              plugins: [require('autoprefixer')]  //自动生成浏览器兼容性前缀
            }
          },

          'less-loader'
        ],
        exclude: /node_modules/
      }
    ]
  }
}
```

3 把JS代码向低版本转换: `babel-loader`

```js
// S1 安装loader + loader依赖的其他文件库
npm install babel-loader -D

npm install @babel/core @babel/preset-env @babel/plugin-transform-runtime -D
npm install @babel/runtime @babel/runtime-corejs3

//S2 配置规则 - webpack.config.js
module.exports = {
  //...
  modules: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel-loader'],
        exclude: /node_modules/       //排除 node_modules 目录
      }
    ]
  }
}

//S3 创建 .babelrc文件  =>
//    相当于 modules.rules[ { ..., use: {yyy, options: {...} }, } ]
{
  "presets": ["@babel/preset-env"],
  "plugins": [

    [
      "@babel/plugin-transform-runtime",
      {
        "corejs": 3
      }
    ]

  ]
}
```


## <span id="5"> 五 常见plugin使用 </span>

1 `打包结束后` + 根据模板 自动生成dist/html文件，引入 打包后的JS文件: `html-webpack-plugin`

```js
//S1 安装 plugin
npm i -D html-webpack-plugin

//S2 配置规则 - webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  ......
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/index.html')
    })
  ]
}
```
</br>


2 `打包开始前` + 清除上一次打包的dist目录: `clean-webpack-plugin`

```js
//S1 安装 plugin
npm i -D clean-webpack-plugin

//S2 配置规则 - webpack.config.js
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  ......
  plugins: [
    //不删除dll目录下的文件
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*', '!dll', '!dll/**']
    })
  ]
}
```
</br>

3 区分合并 开发环境/生成环境下 `webpack的配置内容`: `wepack-merge`

```js
//S1 安装 plugin
npm install webpack-merge -D

//S2 配置规则 - webpack.config.js
const merge = require('webpack-merge');
merge(common.common.js . dev/prod.conf.js)

// S3 package.json
{
  "dev":   "webpack-dev-server --config webpack.dev.js",
  "build": "webpack --config webpack.prod.js"
}
```
</br>

4 xxxxx




## <span id="6"> 六 其他 基础配置 </span>

![其他基础配置 导图](https://s1.ax1x.com/2020/04/16/JkKUa9.md.png)


1 devtool

- S1 作用: 配置source-map + 形成 打包文件和源文件 报错信息的 映射关系

- S2 常见配置实践： 开发环境： cheap-module-eval-source-map / 生产环境：cheap-module-source-map

```html
cheap: 报错信息只定位到行 而不是列 + 只处理业务文件，不检测第三方库文件
module: 监测 第三方库文件的 报错信息
eval: 以eval形式 而非.map文件 进行信息映射，效率最高
source-map: 进行映射转换
inline: 在打包文件内进行映射，而非形成 单独的 .map文件
```

</hr>

2 devSever

- S1 作用: 自动监测文件内容变化 + 自动刷新页面

- S2 实现方式: webpack --watch / webpack-dev-server / webpack-dev-middleware

```js
//S1 安装 webpack-dev-server
npm i -D webpack-dev-server

//S2 配置规则 - webpack.config.js
module.exports = {
  ......
  devServer: {
    contentBase: './dist'  // 检测文件目录
    open: true,            // 新开页面
    port: 8080,            // 指定端口号
    proxy: {...}           // 设置代理

  },
}

// S3 新增npm scripts- package.json
{
  ......
  "scripts": {
    "watch": "webpack --watch",
    "start": "webpack-dev-server",
    "build": "webpack"
  }
}
```

</hr>

3 HMR

- S1 作用: 在运行时 只更新发生变化的模块内容，而不完全刷新页面

```js

//配置规则 - webpack.config.js
const webpack = require('webpack')   // S1 引入webpack
module.exports = {
  ......
  devServer: {
    ......
    hot: true              //S2 开启热更新
  },

  plugins: [
    .....
    new webpack.HotModuleReplacementPlugin() //S2 实例化 热更新插件
  ]
}

// S3 在入口文件中新增:
if(module && module.hot) {
  module.hot.accept('./xxx目录', () => {
    // 逻辑处理函数
  })
}
```