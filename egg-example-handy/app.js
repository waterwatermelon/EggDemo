// 
class AppBootHook{
    constructor(app){
        this.app = app;
    }
    configWillLoad(){
        console.log('=========configWillLoad event========')
    }
    configDidLoad(){
        console.log('=========configDidLoad event========')
    }
    didLoad(){
        console.log('=========didLoad event========')
    }
    willReady(){
        console.log('=========willReady event========')
    }
    didReady(){
        console.log('=========didReady event========')
    }
    serverDidReady(){
        console.log('=========serverDidReady event========')
        // 对外开放服务成功,对应用进行监听
        this.app.once('server',(server)=>{
            console.log('=========server event========')
        // console.log('server = ',server);
        })
        this.app.on('error',(err,ctx)=>{
            console.log('========error event=========')
            console.log(err.message);
        })
        // ？一次请求会触发2次该事件，response事件同理
        this.app.on('request',(ctx)=>{
            console.log('========request event=========')
            // console.log(ctx);
        })
        this.app.on('response',(err)=>{
            console.log('========response event=========')
            // console.log(ctx);
        })
    }
    beforeClose(){
        console.log('=========beforeClose event========')
    } 
}
module.exports = AppBootHook;
// (app)=>{
//     // 对外开放服务成功
//     app.once('server',(server)=>{
//         console.log('=========server event========')
//         // console.log('server = ',server);
//     })
//     app.on('error',(err,ctx)=>{
//         console.log('========error event=========')
//         console.log(err.message);
//     })
//     app.on('request',(err)=>{
//         console.log('========request event=========')
//         console.log(req);
//     })
// }