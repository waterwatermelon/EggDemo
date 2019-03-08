// 写法1
module.exports = ()=>{
    console.log('加载中间件report'); 
    return async function(ctx,next){
        console.log('使用中间件report');
        const startTime = Date.now();
        // next 是后置函数，后置中间件或者控制器？
        await next();
        // 上报请求时长
        console.log('请求时长:'+(Date.now()-startTime)/1000+'秒');
    }
}
// 写法2
// async function rep(ctx,next){
//     const start = Date.now();
//     await next();
//     console.log('请求时长:'+(Date.now()-startTime)/1000+'秒');
// }
// module.exports = ()=>{
//     return rep;
// };
// 写法3 非异步函数
// module.exports = ()=>{
//     function test(){
//         console.log('test');
//     }
//     return test;
// }