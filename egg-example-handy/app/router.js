// egg根据既定的项目目录结构，生成工程

module.exports = (app)=>{
    const {router,controller} = app;    
    // router.get('/',(ctx)=>{ ctx.body = 'hello '}); //app为何能访问到controller？
    router.get('/',controller.home.index); // 
    router.get('/news',controller.news.list); // 
    // 配置动态路由，参数保存在ctx.params对象中
    router.get('/news/:id',controller.news.checkId); 
};