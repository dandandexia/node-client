# node 中间层框架，开箱即用
## 简介
该项目为node中间层解决方案，提供了完整的开发与线上功能（如热加载、mock数据、UA检测、日志管理、接口代理、静态资源版本号控制、线上代码版本控制<方便回滚>等），也已经有线上使用案例，后续会根据线上使用经验对本方案进行更新，工程内提供了大量命令用于快速开发，可大大提高工作效率。

## 环境配置
### 安装node及相关工具
```
yum install node  // v>=9.10.1
npm config set registry https://registry.npm.taobao.org 
npm install -g typescript ts-node pm2

//线上
npm install --production
//开发环境
npm install

// 测试：项目目录下
sh deploy.sh dev
//线上
sh deploy.sh online
```
注：如果出现ts-node pm2命令不可用的情况，查看安装目录修改环境变量配置即可

## 技术栈
### server端
+ node
+ typescript
+ express
+ swig
+ pm2
+ log4js
+ nodemon

### client端
+ typescript
+ react
+ vue（与react二选一）
+ webpack4
+ browserSync

## 开始开发
### 启动服务
```
npm run server
```
启动服务后可在http://127.0.0.1:3000 查看，开发环境使用nodemon进行代码热启动

### 浏览器端开发
```
npm run dev
```
启动服务后可在http://本机ip:3100 查看项目并进行开发，使用browserSync进行浏览器热更新

### 新建页面
```
npm run page //wap
npm run page:pc
```
提供了三种页面创建方式，服务端渲染、vue渲染、react渲染，进行选择后对自动创建模板文件以及更新静态资源引用，直接添加router即可查看页面

### 新建组件
```
npm run comp
```
创建组件，目前仅支持react模板

### 打包代码
```
npm run build
```
打包浏览器端代码

### 生成静态资源版本号
```
npm run md5
```
生成的版本号可在 server/assets_md5.json进行查看

### mock数据
```
npm run dev:mock
```
此模式下接口请求将返回本地主数据，mock的数据请求通过config/mock.ts进行配置
