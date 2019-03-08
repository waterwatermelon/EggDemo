const Service = require('egg').Service;
class NewsService extends Service{
    async list(page = 1){
        // 从config中读取配置参数
        const { serverUrl,pageSize } = this.config.news;
        // 使用内置http client 来请求API
        // 第一个参数：请求路径
        // 第二个参数：请求头，请求体
        const res = await this.ctx.curl(`${serverUrl}`)
        const data = JSON.parse(res.data);
        const movies = data.subjects;
        // console.log(movies);        
        // promise.all 方法会返回一个Promise实例
        // 输入参数，可执行异步代码 数组
        // 等待所有异步代码执行结束
        // const newsList = await Promise.all(
        //     Object.keys(idList).map((key)=>{
        //         const url = `${serverUrl}/item/${idList[key]}.json`;
        //         return this.ctx.curl(url,{dataType:'json'});
        //     })
        // )
        return {movies:movies};
    }
}
module.exports = NewsService;
