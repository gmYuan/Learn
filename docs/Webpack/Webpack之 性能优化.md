# Webpack之 性能优化

### 目录

1 [预读文档](#1)

2 [Tree shaking](#2)

3 [Code splitting](#3)

4 [懒加载 + 预加载](#4)

5 [常见plugin使用](#5)

6 [其他 基础配置](#6)


## <span id="1"> 一 预读文档 </span>

01 [webpack 官方文档](https://webpack.docschina.org/guides/)

02 [再不会webpack敲得代码就不香了](https://juejin.im/post/5de87444518825124c50cd36)

03 [带你深度解锁Webpack系列(基础篇)](https://juejin.im/post/5e5c65fc6fb9a07cd00d8838)

阅读原因: 直接参考文档


## <span id="2"> 二 Tree shaking </span>

1 作用: webpack在打包时 `移除 导出模块中 未被使用的 内容/文件`

2 配置方法:

```js
//S1 开发环境下 wenpack.config.js
module.exports = {
  ......
  mode: 'development',
  optimization: {
    usedExports: true
  },
}

//S2 package.json文件
{
  "sideEffects": false / ["*.css"] //  对全部文件/除排除文件外 使用tree-shaking配置 
}
```

3 注意事项

> (1) 只支持 ES6 模块语法
> (2) production会 自动启用 tree shaking


## <span id="3"> 三 Code splitting </span>

1 作用: 把公共代码抽离到 不同的打包文件中:

- 可以 `提取公共 依赖模块` => 获取更小的 bundle

- 可以 `按需加载/并行加载 这些文件`

2 配置方法:

```js
//S1 wenpack.config.js
module.exports = {
  ......
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {...}  //其他字段，查看 split-chunks-plugin
  },
}
```

## <span id="4"> 四 懒加载 + 预加载 </span>

1 懒加载 作用: `按需加载/条件加载` 某些模块

2 配置方法: webpack内置处理 `import(**)`

- 以 *** 为入口新生成一个 Chunk;

- 当代码执行到 import()语句时，才会加载 该Chunk对应的文件

3 具体原理，参考[ES6- import()语法](https://es6.ruanyifeng.com/#docs/module#import)
</hr>


4 预加载作用: 按序加载后，在主chunk加载完成后，利用空余时间加载 交互相关chunk

```js
// 业务文件...
import(/* webpackPrefetch: true */ 'LoginModal') // 魔法编译

// 原理:
生成 <link rel="prefetch" href="login-modal-chunk.js"> 并追加到页面头部
指示着浏览器在闲置时间预取 login-modal-chunk.js 文件
```

5 prefetch 与 preload 区别：

- preload chunk 会在父 chunk 加载时，以并行方式开始加载; prefetch chunk 会在父 chunk 加载结束后开始加载







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