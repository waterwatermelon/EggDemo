let fs = require('fs')
// let data = [{
//         title:'标题',
//         director:'导演',
//         rate: 9.5,
//         year: 2012,
//         genre:'喜剧'
//     }];
function write(data){
    fs.writeFile('data.json',JSON.stringify(data),function(err,data){
        if(err){
            console.log(err.message);
        }else{
            
        }
    })
}
module.exports = write;