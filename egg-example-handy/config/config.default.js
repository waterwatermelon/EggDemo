// exports.keys = <此处改为你自己的 Cookie 安全字符串>;
exports.keys = 'sue';
// 添加 view 配置
exports.view = {
    defaultViewEngine:'nunjucks',
    mapping:{
        '.tpl':'nunjucks'
    }
}
// 添加 news 配置，配的是服务还是控制器，或者都有管理
exports.news = {
    pageSize:5,
    serverUrl:'http://api.douban.com/v2/movie/top250'
}
// 应用，框架，插件均可配置