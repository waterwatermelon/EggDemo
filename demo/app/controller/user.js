const Controller = require('egg').Controller;
class UserController extends Controller{
    async register(){
        const {ctx} = this;
        const success = await ctx.service.user.register();
        const resData = {
            success:success,
            msg:'',
            data:{}
        }
        if(success){
            resData.success = true;
            resData.msg = '成功';
        }
        ctx.body = resData;
    }
    async login(){
        const {ctx} = this;
        const success = await ctx.service.user.login();
        const resData = {
            success:success,
            msg:'',
            data:{}
        }
        ctx.body = JSON.stringify(resData); 
    }
    async logout(){
        const {ctx} = this;
        const success = await ctx.service.user.logout();
        const resData = {
            success:success,
            msg:'',
            data:{}
        };
        console.log(resData);
        ctx.body = JSON.stringify(resData); 
    }
}
module.exports = UserController;