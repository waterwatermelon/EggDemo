// 作用于GET请求
module.exports = (options,app)=>{
    return async function(ctx,next){
        // let { router } = app;
        // 登录拦截 非首页请求
        // 1.检查session中是否有用户信息 
        // 1.1 有，放行
        // 1.2 没有，提示，跳转登录页面
        // ctx.session = {
        //     user:{
        //         name:'',
        //         password:'',
        //     }
        // }
        if(ctx.request.method==='GET'){
            if(ctx.session.user === undefined){
                // 跳转登录页面
                console.log('未登录->页面跳转');
                console.log(ctx.req)
                ctx.redirect('/');  
            }else{
                // 放行
                await next();
            }
        }else{
            await next();
        }
    }
}