// ihpone X 模式打开百度，并保存截图
const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors')
async function foo(){
    const browser = await puppeteer.launch({
        headless:false
    })
    const page = await browser.newPage();
    await page.emulate(devices['iPhone X']);
    await page.goto('http://www.baidu.com')
    page.screenshot({
        path:'/home/sue/NodeProject/nodeDemo/puppeteer入门/baidu_iPhoneX.png'
    })
}
foo()
