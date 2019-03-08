// 配置安全秘钥
exports.keys = '123';
// 配置view
exports.view = {
    // defaultViewEngine: 'ejs',
    mapping: {
        '.html': 'ejs',
    },
}
// 配置数据源
exports.mysql = {
    // 单数据库配置信息
    // 客户端
    client:{
        host:'192.168.167.97',
        port:'3306',
        user:'root',
        password:'123456',
        database:'douban'
    },
    // 是否加载到app上，默认开启
    app:true,
    // 是否加载到agent上，默认关闭    
    agent:false
}
exports.middleware = ['validateLogin'];
exports.validateLogin = {
    ignore:(ctx)=>{
        return ctx.path == '/'; 
    }
}
exports.security = {
    csrf:{
        enable:false
    }
} 
