const mysql = require('mysql');
const fs = require('fs');
let connectionOption = {
    host: '192.168.167.97',
    user: 'root',
    password: '123456',
    database: 'douban'
};
let con = mysql.createConnection(connectionOption);
let clearSql = 'truncate table movie';
let addSql = 'insert into movie(id,title,director,rate,year,quote,img) values(0,?,?,?,?,?,?)';
let addParams = [];
let data ;
function transformUrlToFilename(url){
    let filename = '';
    let arr = url.split('/');
    filename ='./assets/images/'+arr[arr.length-1];
    return filename;
}
function getAddParams(obj) {
    let arr = [];
    arr[0] = obj['title'];
    arr[1] = obj['director'];
    arr[2] = obj['rate'];
    arr[3] = obj['year'];
    arr[4] = obj['quote'];
    arr[5] = transformUrlToFilename(obj['img']);
    return arr;
}
data = JSON.parse(fs.readFileSync('data.json'))
con.query(clearSql,function(err){
    if(err){
        console.error('[ERROR]',err.message)
    }
});
data.forEach(element => {
    addParams = getAddParams(element);
    con.query(addSql,addParams,function(err){
        if(err){
            console.error('[ERROR]',err.message)
        }
    });
});
con.end();

