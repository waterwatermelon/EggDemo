const Controller = require('egg').Controller;
// 我们第一步需要编写的是 Controller 和 Router。
// 主页面的路由
class HomeController extends Controller{
    async index(ctx){
        // ctx 在控制中的两种获取方式
        // 1.从Controller基类继承
        // this.ctx.body = 'hello world';// this 指向 当前控制器?
        // 2.从入参获取
        ctx.body = 'hello ';
    }
}
module.exports = HomeController;