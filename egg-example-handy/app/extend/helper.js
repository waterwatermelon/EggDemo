const moment = require('moment');
// 根据项目需求，编写的扩展功能
// 扩展可在模板中使用
exports.relativeTime = (time)=>{
    // 根据日期对象，格式化一个‘xx时间前’；
    return moment(new Date(time*1000)).fromNow();
};