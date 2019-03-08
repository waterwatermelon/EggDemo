const fs = require('fs');
const request = require('request');
const mysql = require('mysql');
let writeStream = '';
let readStream ;
let urls = [];
function urlToFilename(url){
    let filename = '';
    let arr = url.split('/');
    // filename ='../frontEnd/assets/images/'+arr[arr.length-1];
    filename = arr[arr.length-1];
    return filename;
}
async function delay(ms){
    return new Promise((resolve,reject)=>{
        setTimeout(resolve,ms);
    });
}
function getUrls(){
    let option = {
        host:'192.168.167.97',
        user:'root',
        password:'123456',
        database:'douban'
    }
    let con = mysql.createConnection(option);
    let sql = 'select img from movie';
    con.connect();
    con.query(sql,(err,data)=>{
        if(err){
            console.error('[ERROR]',err.message);
            con.end();
        }else{
            console.error('[data] =',data);
            console.error('[Select over]');
            urls = data.map((item)=>item.img);
            con.end();
            downLoad().then(()=>{
                console.log('download over');
            },(err)=>{
                console.log(err.message)
            });
        }
    })
}
async function downLoad(){
    // urls.forEach((url)=>{
    for(let url of urls){
        writeStream = fs.createWriteStream(urlToFilename(url));
        readStream = request('https://img3.doubanio.com/view/photo/s_ratio_poster/public/'+urlToFilename(url));
        readStream.pipe(writeStream);
        readStream.on('end',()=>{
            console.log('文件下载成功');
        });
        readStream.on('error',(err)=>{
            console.log('文件下载出错：',err.message);
        });
        writeStream.on('finish',()=>{
            console.log('文件写入成功');
            writeStream.end();
        })
        await delay(500);
    }
}
getUrls();

module.exports = downLoad;