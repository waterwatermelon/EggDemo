// 以iphone X模式打开百度，找到输入框，输入puppeteer，按下搜索按钮。
// 跳转到查询结果页面之后，截图保存
const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
(async ()=>{
    const broswer = await puppeteer.launch({
        headless:false
    })
    const page = await broswer.newPage();
    await page.goto('http://www.baidu.com')
    // 找到#index-kw元素，并键入puppeteer
    await page.type('#kw','puppeteer');
    // 点击搜索键
    await page.click('#su')

    // await page.waitForNavigation({timeout:10000})
    await page.screenshot({
        path:'baidu_search.png'
    }); 
    // pdf 为实现
    await page.pdf({ 
        path:'page.pdf'
    })
    broswer.close();
})().then(()=>{},(err)=>{
    console.log(err.message);
})