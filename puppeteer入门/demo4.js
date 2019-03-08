const assert = require('assert');
const fs = require('fs');
const puppeteer = require('puppeteer');
(async () => {

    async function getResourceTree(page) {
        var resource = await page._client.send('Page.getResourceTree');
        return resource.frameTree;
    }
    async function getResourceContent(page, url) {
        
        const { content, base64Encoded } = await page._client.send(
            'Page.getResourceContent',
            { frameId: String(page.mainFrame()._id), url },
        );
        assert.equal(base64Encoded, true);
        return content;
    }
    async function downloadImg(page,url,filename){
        const content = await getResourceContent(page,url)
        const contentBuffer = Buffer.from(content,'base64');
        fs.writeFileSync('1.jpg',contentBuffer, 'base64');
    }
    const browser = await puppeteer.launch({
        headless:false,
    })
    const page = await browser.newPage();
    // await page.goto('http:www.baidu.com');
    await page.goto('https://movie.douban.com/top250');
    await page.waitForSelector('.artice .item img');
    // ? 
    const url = await page.$eval('.artice .item img', i => i.src);
    console.log(typeof url)
    console.log(url)
    const content = await getResourceContent(page, url);
    const contentBuffer = Buffer.from(content, 'base64');
    fs.writeFileSync('1.png', contentBuffer, 'base64');
    browser.close();
})().then(()=>{},
(err)=>{
    console.log(err.message);
});
