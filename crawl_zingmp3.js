const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    // headless: false
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  const crawlData = {
    //1
    'nhạc trẻ': {
      link: 'https://zingmp3.vn/album/Top-100-Bai-Hat-Nhac-Tre-Hay-Nhat-Various-Artists/ZWZB969E.html'
    },
    //2
    // 'nhạc trữ tình': {
    //   link: 'https://www.nhaccuatui.com/bai-hat/tru-tinh-moi.html',
    //   listLink: []
    // },
    //3
    'nhạc trịnh': {
      link: 'https://zingmp3.vn/album/Top-100-Nhac-Trinh-Hay-Nhat-Various-Artists/ZWZB96A9.html'
    },
    //4
    'nhạc cách mạng': {
      link: 'https://zingmp3.vn/album/Top-100-Nhac-Cach-Mang-Viet-Nam-Various-Artists/ZWZB96AO.html'
    }
    //5
    // 'rock việt': {
    //   link: 'https://www.nhaccuatui.com/bai-hat/rock-viet-moi.html',
    //   listLink: []
    // }
  }
  await page.goto('https://zingmp3.vn')
  await page.click('body > div.ReactModalPortal > div > div > div > button')


  let resultObj = {}
  let waitShowMedia = true
  for (let musicType in crawlData) {
    console.log('musicType', musicType)
    resultObj[musicType] = {
      songList: []
    }
    await page.goto(crawlData[musicType].link)
    // show media controller
    await page.click('ul.list-song li a')
    
    // show lyrics
    if (waitShowMedia) {
      await page.waitForSelector('#z-miniplayer > div.z-miniplayer-container > div.z-miniplayer-inner.clearfix > div > div.z-features-wrapper > ul > li.--z--expand-item > a')
      waitShowMedia = false
      await page.click('#z-miniplayer > div.z-miniplayer-container > div.z-miniplayer-inner.clearfix > div > div.z-features-wrapper > ul > li.--z--expand-item > a')
    }
  
    resultObj[musicType].songList = await page.evaluate(() => {
      let resutlArr = []
      for (let item of document.querySelectorAll('ul.list-song>li')) {
        resutlArr.push({
          name: item.querySelector('.title').innerText,
          singer: item.querySelector('.artist').innerText
        })
      }
      return resutlArr
    })
    let i = 0
    for (const songObj of resultObj[musicType].songList) {
      console.log('songObj', songObj.name)
      await page.waitFor(1000)
      let lyricsArr = await page.evaluate(() => {
        let resutlArr = []
        for (let span of document.querySelectorAll('#content span')) {
          resutlArr.push(span.innerText)
        }
        return resutlArr
      })
      songObj.lyrics = lyricsArr.join(' ')
      if (!songObj.lyrics) {
        console.log('No lyrics songObj', songObj)
      }
      await page.click('#z-miniplayer > div.z-miniplayer-container > div.z-miniplayer-inner.clearfix > div > div.z-miniplayer-controls > a.z-btn-next.false.z-tooltip-btn')
      i++
      if (i === 5) {
        break
      }
    }
  }

  
  console.log('resultObj', JSON.stringify(resultObj, 2, 0))
  await fs.writeFileSync('data/zingmp3/data100.json', JSON.stringify(resultObj, 2, 0))
  await browser.close();
})();