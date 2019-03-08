var fs = require('fs');
var request = require("request");

var src = "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p480747492.webp";
var srcArr = src.split('/');
var filename = srcArr[srcArr.length-1];
console.log(filename);
// 一个可写入的流
var writeStream = fs.createWriteStream(filename);
// 一个可读取的流
var readStream = request(src)
// 可读流调用pipe(writeStream):
// 1.这是消费可读流的一种方式
// 2.将可读流切换到流动模式(flowing):数据自动从底层系统读取
readStream.pipe(writeStream);
// 当可读流中没有数据可供消费时触发
readStream.on('end', function () {
    console.log('文件下载成功');
});
// 可读流因底层内部出错，而不能产生数据，或推送无效的数据块时触发
readStream.on('error', function (err) {
    console.log("错误信息:" + err)
})
// 调用stream.end(),且缓冲数据已传给底层时触发
writeStream.on("finish", function () {
    console.log("文件写入成功");
    writeStream.end();
});