const Controller = require('egg').Controller;
class HomeController extends Controller{
    async index(){
        // const {ctx} = this;
        // this.ctx.body = 'hi egg';
        // this.ctx.status = 200;   
        await this.ctx.render('index.html');//render(name, locals) 渲染模板文件, 并赋值给 ctx.body
    }
    async register(){
        await this.ctx.render('register.html');
    }
}
module.exports = HomeController;