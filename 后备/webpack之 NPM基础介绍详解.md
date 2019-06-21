# npm基础介绍详解

## 一 前言
最近在项目中使用了NPM相关基础命令，所以做了一下小结。


## 二 什么是npm

1 npm 是一个包管理器
S1 在程序开发中我们常常需要依赖别人提供的框架
S2 这些可以重复的框架代码被称作包（package）或者模块（module）
S3 一个包可以是一个文件夹里放着几个文件，同时有一个叫做 package.json的文件


2 npm像一个仓库，保存着人们分享的 JS模块
  同时，通过命令行里的客户端，开发者可以使用npm来管理、安装、发布模块


## 三 package.json文件

1 package.json文件的作用：
S1 作为一个描述文件，说明了一个项目中依赖了哪些包
S2 允许我们使用 “语义化版本规则”（后面介绍）指明 项目依赖包的版本
S3 让项目更好地与其他开发者分享，便于重复使用


2 创建package.json
S1 在当前目录创建一个 package.json 文件：`npm init`
S2 跳过回答问题步骤，直接生成默认值的package.json文件：`npm init --yes`


3 package.json文件内容含义
S1 name:          		全部小写，没有空格，可以使用下划线或者横线
S2 version:       		x.x.x 的格式 + 符合“语义化版本规则”
S3 description：  		描述信息，有助于搜索
S4 main:          		入口文件，一般都是 index.js
S5 scripts：      		支持的脚本，默认是一个空的 test
S6 keywords：     		关键字，有助于在使用 npm search搜索时发现你的项目
S7 author：       		作者信息
S8 license：      		默认是 MIT
S9 bugs：         		当前项目的一些错误信息，如果有的话
S10 devDependencies：	在开发、测试环境中 用到的依赖
S11 dependencies：      在生产环境中 需要用到的依赖
   
S12 可以为 init命令设置一些默认值，如：
> npm set init.author.email "xxx.com"
> npm set init.author.name "xxx"
> npm set init.license "MIT"


4 依赖包相关
S1 只有在package.json文件中指定项目依赖的包，别人在拿到这个项目时才可以使用npm install下载依赖
S2 使用npm安装package有两种方式：本地（当前项目路径）安装 / 全局安装
S3 npm install默认会安装 package.json中 dependencies和devDependencies里的所有模块

S4 将包名及对应的版本添加到 package.json的 devDependencies:
   `npm install <package_name> --save-dev`
S5 将包名及对应的版本添加到 package.json的dependencies:
    `npm install <package_name> --save` 


5 Semantic versioning（语义化版本规则）
S1 依赖包的版本是符合语义化版本规则的，简称为“Semver”
S2 为什么要符合语义化版本规则：
> 有时候依赖的包升级后大改版，之前提供的接口不见了，这对使用者的项目可能造成极大的影响
> 因此我们在 声明对某个包的依赖时需要指明 是否允许update到新版本 & 什么情况下允许更新

S3 具体规则是:
（1）补丁版本：解决了Bug 或者一些较小的更改，增加最后一位数字，比如1.0.1
（2）小版本：  增加了新特性，同时不会影响之前的版本，增加中间一位数字，比如 1.1.0
 (3) 大版本：  大改版，无法兼容之前的，增加第一位数字，比如 2.0.0

具体实现写法可参考:
[npm 与 package.json 快速入门](https://juejin.im/entry/598286cb6fb9a03c5b04a4ff#comment)


## 四 npm相关命令

1 安装npm: 下载好node.js, npm也就有了，可以使用`npm -v` 查看安装的npm版本
2 更新npm: `npm install npm@latest -g`

3 只安装dependencies的内容: `npm install --production`

4 本地安装依赖包: `npm install <package_name>`
5 下载指定版本包: `npm install sax@0.1.1` 或者 `npm install sax@">=0.1.0 <0.2.0"`

6 查看本地依赖的包是否有新版本：`npm outdated`
7 更新本地 package: `npm update <package-name> / npm update 更新所有`
8 卸载本地 package: `npm uninstall <package-name>`

9  全局安装 package:`npm install -g <package-name>`
10 查看全局依赖的包是否有新版本:`npm outdated -g --depth=0`
11 更新指定的全局包:`npm update -g <package>`
12 卸载全局 package:`npm uninstall -g <package>`



## 参考文档
[01 npm与package.json快速入门](https://juejin.im/entry/598286cb6fb9a03c5b04a4ff#comment)
[02 你还是只会npm install吗](https://juejin.im/post/5ab3f77df265da2392364341)