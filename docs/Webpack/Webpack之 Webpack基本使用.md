# Vue源码分析之 响应式原理

### 目录

1 [预读文档](#1)

2 [基本含义](#2)

3 [常见loader使用](#3)

4 [常见plugin使用](#4)


## <span id="1">一 预读文档 </span>

01 [0 到 1 掌握：Vue 核心之数据双向绑定](https://juejin.im/post/5d421bcf6fb9a06af23853f1)

02 [深入浅出Vue 第2章](/)

阅读原因: 直接参考文档

03 [深入源码学习Vue响应式原理](https://juejin.im/post/5dc0ea64e51d455818621891)

直接参考文档: 源码执行流程的 学习思路可以学习一下


## <span id="2"> 二 基本含义 </span>

Q1: Webpack有什么 功能/作用

A:

S1 `代码转换`：SCSS 编译成 CSS;

S2 `代码分割`: 提取多个页面的公共代码;

S3 `模块合并`：把 多个模块化文件 分类合并成一个文件;

S4 `文件优化`: 压缩代码，压缩合并图片等;

S5 `自动刷新`: 监听本地源代码的变化，自动刷新浏览器;

S6 `代码校验`: 校验代码是否符合规范

S7 `自动发布`: 自动构建出线上发布代码


Q2: 什么是 Webpack

A:

S1 Webpack 是一个 `模块化打包工具`，webpack中 各种类型的文件 都被当做模块处理;

> S2 它会从 主入口模块开始，识别出其中的模块化导入语句;

> 递归地寻找 出入口文件的所有依赖，把 入口和其所有依赖打包到一个单独的文件中


Q3: 什么是 Loader + 使用loader的一般步骤是什么

A:

S1 Loader可以看作是一个 具有文件转换功能的翻译员;

S2 module.rules数组 配置了一组规则，告诉Webpack `在遇到哪些文件时使用 哪些Loader 去加载和转换`

S3 Loader的 执行顺序是由后到前的 + 每一个Loader 都可以传入options配置对象


使用loader的一般步骤是:

- S1 安装loader依赖

- S2 配置对应转换的 `文件类型: test + 转换loader: use`


Q4: 说一说Webpakc的 核心概念有哪些

A:

- S1 Entry: Webpack所有构建流程的 入口文件;

- S2 Module: 模块，在Webpack里 一切皆模块，一个模块对应着一个文件,Webpack 会递归找出 所有依赖模块

- S3 Chunk: 代码块，一个 Chunk 由多个模块组合而成，用于代码合并与分割

- S4 Loader：模块转换器，用于 把模块原内容 按照需求 转换成新内容;

- S5 Plugin：扩展插件，在 Webpack构建流程中的 特定时机 注入扩展逻辑 来优化功能

- S6 Output: 输出结果，在 Webpack 经过一系列处理, 产生的结果

即

> S1 Webpack启动后会从 Entry的Module开始, 递归解析 Entry依赖的所有 Module;

> S2 每找到一个 Module， 就会根据配置的 Loader去找出 对应的转换规则;

> S3 对 Module进行转换后，再解析出当前 Module依赖的 Module;

> S4 这些模块会以 Entry为单位进行分组，一个 Entry 和其所有依赖的Module 被分到一个组,也就是一个 Chunk

> S5 最后Webpack 会把所有Chunk转换成 文件输出

> S6 在整个流程中 Webpack 会在恰当的时机执行 Plugin里定义的生命周期钩子



## <span id="3"> 三 常见loader使用 </span>

Q1 如何用代码实现 Object类型的 响应式数据

A: 代码见下

