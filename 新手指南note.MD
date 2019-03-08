# 设计原则
- 一个插件只做一件事,扩展性好
- **约定**优于配置 使用[Loader](https://eggjs.org/zh-cn/advanced/loader.html)可以让框架根据开发环境，定义默认配置，甚至覆盖Egg默认约定
# 与社区框架的差异~~ni~~
而 Egg 不直接提供功能，只是**集成**各种功能插件，比如实现 egg-blueprint，egg-waterline 等这样的插件，再使用 sails-egg 框架整合这些插件就可以替代 Sails 了。

# 特性
- 内置多进程管理
- ?[渐进式开发](https://eggjs.org/zh-cn/tutorials/progressive.html) 

# Egg与 Koa
# 异步编程模型
Node.js 是异步的世界，官方 API 支持的是 callback 形式的异步编程模型。会带来以下问题：
- callback hell / 回调地狱 / 回调嵌套
- release zalgo 异步操作导致数据不一致性
对应解决方案
- Promise in ECMAScript 2015/ES6
- 语法糖 async function 
  - async function中可使用await关键字，等待Promise状态改变

# Koa 
设计风格与Express相似，不同点：
## Middleware 为洋葱圈模型：从请求到中间处理程序再到响应
- 中间执行顺序（使用Generator描述?）
- 所有请求经过一个中间件的时候会**执行两次**
- 优点：方便编写后置处理逻辑
## Context  上下文 
与Express只有Request和Response两个对象不同，Koa增加Context对象（在 Koa 1 中为中间件的 this，在 Koa 2 中作为中间件的第一个参数传入），可将一次请求相关的上下文(?)都挂载到上面，类似 **traceId**这种需要贯穿整个请求（在后续任何一个地方进行其他调用都需要用到）的属性就可以挂载上去。
同时Context 也挂载了request和response两个对象，提供便捷方法辅助开发。
## 异常处理
使用try catch 可捕获代码中的所有错误，借此编写自定义**错误处理中间件**。
```js
async function onerroe(ctx,next){
    try{
        await next();//next是将要运行的异步代码？
    }catch(err){
        ctx.app.emit('error',err);
        ctx.body = 'server error';
        ctx.status = err.status||500;
    }
}
```
将此中间放置其他中间件之前，就可以捕获后置中间件中的异常。
# Egg继承于Koa
## 扩展
定义app/extend/{application,context,request,response}.js来扩展Koa中对应的四个对象的原型  
```js
//例如：app/extend/context.js中写入下列代码
module.exports = {
    get isIOS(){
        //验证IOS设备的正则
        const iosReg = /iphone|ipad|ipod/i;
        // 从context对象的user-agent字段中可以获取设备类型字符创
        // ？无法直接获取操作系统
        return iosReg.test(this.get('user-agent)');
    }
}
```
```js
// 在app/controller/home.js 中使用
exports.hander = ctx =>{
    // ?ctx.body 对象的用处
    ctx.body = ctx.isIOS
    ? 'Your operating system is iOS.'
    : 'Your operating system is not iOS.';
}
```
## 插件
Egg提供了一个机制，让独立领域的功能模块更容易编写
一个插件可包含：
- extend 扩展基础对象的上下文，增加各种工具类，属性
- middleware ？增加一个或多个中间件，提供请求的前置、后置处理逻辑
- config 配置各个环境下插件的默认配置项
## Egg与Koa版本关系
Egg 2.X 支持Node.js 8及以上版本

