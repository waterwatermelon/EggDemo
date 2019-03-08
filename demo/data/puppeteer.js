const write = require('./write')
const puppeteer = require('puppeteer')
const downloadImages = require('./downloadImages');
function transformUrlToFilename(url){
    let filename = '';
    let arr = url.split('/');
    filename ='./assets/images/'+arr[arr.length-1];
    return filename;
}
let scrape = async () => {
    const browser = await puppeteer.launch({
        headless: true
    })
    const page = await browser.newPage()
    await page.goto('https://movie.douban.com/top250')
    let whole_list = []
    for (;;) {
        // evaluate的回调中可以访问浏览器对象，进行DOM操作
        const result = await page.evaluate(() => {
            let data = []
            let elements = document.querySelectorAll('.article .item')
            for (let element of elements) {
                let title = element.querySelector('.info .title').innerHTML
                console.log('get title');
                let director = element.querySelector('.bd p').innerHTML.split(':')[1].split('主演')[0].split(' ')[1]
                let rate = element.querySelector('.star .rating_num').innerHTML
                let year = element.querySelector('.bd p').innerHTML.split('<br>')[1].split('/')[0].trim().slice(0,4);
                let quote = element.querySelector('.quote .inq');
                quote = quote ? quote.innerHTML:'';
                let img = element.querySelector('img').src;
                data.push({
                    title,  
                    director,
                    rate:parseFloat(rate),
                    year:Number(year),
                    quote:quote,
                    img:img,
                    // img:transformUrlToFilename(url)
                })
            }
            return data
        })
        whole_list = whole_list.concat(result)
        try {
            if (page.$('.next a')) {
                await page.click('.next a')
                await page.waitFor(1000)
            } else {
                break
            }
        } catch (error) {
            break
        }
    }
    browser.close()
    return whole_list
}

scrape().then((value) => {
    let urls = value.map((item)=> item.img);
    console.log('total length:', value.length)
    write(value);
    downloadImages(urls);
},(err)=>{
    console.log(err.message);
})