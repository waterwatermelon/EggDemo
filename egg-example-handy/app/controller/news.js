const Controller = require('egg').Controller;
class NewsController extends Controller{
    async list(){
        // const dataList = {
        //     list:[
        //         { id:1,title:'this is new 1',url:'/news/1'},
        //         { id:2,title:'this is new 2',url:'/news/2'}
        //     ]
        // }
        const ctx = this.ctx;
        const {pageSize} = this.config.news;
        console.log('in controller news,pageSize = ',pageSize);
        // ctx.query 是 url后的请求参数？
        const newsList = await ctx.service.news.list();
        // await this.ctx.render('news/list.tpl',newsList);
        await this.ctx.render('news/list.html',newsList);
    }
    async checkId(){
        const {ctx} = this;
        ctx.body = 'request id = '+ctx.params.id;
    }
}
module.exports = NewsController;