// puppeteer 是Google公司对Chrome Devtools 开放接口的封装
// 打开百度，保存截图
const puppeteer = require('puppeteer');
(async ()=>{
    // 启动一个浏览器
    const browser = await puppeteer.launch({
        headless:true
    })
    const page = await browser.newPage();
    await page.goto('http://www.baidu.com')
    await page.screenshot({
        path:'/home/sue/NodeProject/nodeDemo/baidu.png'
    }) 
    browser.close();
})() 
