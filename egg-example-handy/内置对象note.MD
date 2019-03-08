## Controller 的写法
- class
- exports = 函数 （不推荐）
- 推荐使用class 可以更好的对代码进行抽象和封装
  - 一些统一的处理抽象成私有方法） 
  - Controller 基类封装着常用的方法
- 每个Controller都是一个**async function**，入参为Context实例对象（框架为我们提供许多便捷的方法）
## Application 对象
    几乎可以在编写应用的任何地方获取到
### 常用获取方式如下：
- 启动自定义：框架定义了同一的入口文件app.js，进行启动过程自定义。该文件返回一个Boot类，通过定义Boot类中的生命周期函数来执行对应的初始化工作。app.js可完成初始化操作后，才成功启动应用，对外开放服务。
    - configWillLoad 配置即将加载，此时可动态改变配置
    - configDidLoad  配置加载完成，此时不可更改配置
    - didLoad   文件加载完成 ?源文件
    - willReady 插件启动完毕
    - didReady  worker准备就绪，应用启动完成 ?worker与应用的关系
    - serverDidReady 对外服务开放
    - beforeClose  应用即将关闭
    - 注意：在以上生命周期不宜执行过于耗时的操作，框架有耗时检测
- Controller 文件
```js
// app/controller/user.js
const Controller = require('egg').Controller;
class UserController extends Controller{
    async fetch(){
        // 1.可以在Context对象上获取Application
        // this.ctx.body = this.ctx.app.cache.get(this.ctx.query.id);
        // 2.在继承于 Controller, Service 基类的实例中，可以通过 this.app 访问到 Application 对象。
        this.ctx.body = this.app.cache.get(this.ctx.query.id);//根据用户id，获取写在缓存里的用户信息
    }
}
```
## Context 对象
- 请求级别的对象，继承自 Koa.Context。
- 每次接收一次请求，框架就会实例化一个Context对象。
- 挂载了所有Service
- 插件也会挂载方法和对象，到它上面
### 常用获取方式
    Middleware, Controller 以及 Service 
## Request & Response
    Request & Response 均是请求级别的对象。
### 获取方式
    在Context实例上获取Request和Response实例
```js
// app/controller/user.js
class UserController extends Controller {
  async fetch() {
    const { app, ctx } = this;
    const id = ctx.request.query.id;
    ctx.response.body = app.cache.get(id);
  }
}
```
- Koa 在Context实例上**代理**？一部分Request和Response属性
- const id = ctx.request.query.id;//获取url中参数
## Controller
### 框架提供 Controller 基类，并推荐所有的 Controller 都继承于该基类实现。这个 Controller 基类有下列属性： 
- ctx 本次请求的Context实例
- app 应用的实例
- config 应用的配置
- service 应用的所有service
- logger 为当前controller 封装的logger对象

## Service
### 框架提供了一个 Service 基类，并推荐所有的 Service 都继承于该基类实
Service 基类的属性和 Controller 基类属性一致，访问方式也类似

## Helper 
- 用来提供一些实用的utility函数。可将一些常用动作抽离出来，放在helper.js。
- 在每次请求时进行实例化。挂载到Context实例上。
- helper中可获取当前上下文。

## Config
推荐应用开发遵循 **配置和代码分离** 的原则,将 **硬编码** 的业务配置都放到配置文件中。
### 获取方式
- 我们通过 app.config 从 Application 实例上获取到 config 对象
- 也可以在 Controller, Service, Helper 的实例上通过 this.config 获取到 config 对象。
## Logger 日记对象
常用方法
- logger.debug()
- logger.warn()
- logger.info()
- logger.error()
## Subscription 订阅模式


