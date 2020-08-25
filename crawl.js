const puppeteer = require('puppeteer');

(async () => {
  const fs = require('fs')
  const crawlData = {
    //1
    'nhạc trẻ': {
      link: 'https://www.nhaccuatui.com/bai-hat/nhac-tre-moi.html',
      listLink: []
    },
    //2
    'nhạc trữ tình': {
      link: 'https://www.nhaccuatui.com/bai-hat/tru-tinh-moi.html',
      listLink: []
    },
    //3
    'nhạc trịnh': {
      link: 'https://www.nhaccuatui.com/bai-hat/nhac-trinh-moi.html',
      listLink: []
    },
    //4
    'nhạc cách mạng': {
      link: 'https://www.nhaccuatui.com/bai-hat/cach-mang-moi.html',
      listLink: []
    },
    //5
    'rock việt': {
      link: 'https://www.nhaccuatui.com/bai-hat/rock-viet-moi.html',
      listLink: []
    }
  }
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();
  
  // await page.setViewport({ width: 1200, height: 1800 });
  let resultObj = {}
  for (let musicType in crawlData) {
    console.log('musicType', musicType)
    resultObj[musicType] = {
      songList: []
    }
    // Get list song link
    for (let i = 0; i < 5; i++) { // i < 5
      let link = `${crawlData[musicType].link.split('.html')[0]}${i ? '.' + i : ''}.html`
      console.log('link', link)
      await page.goto(link, {
        // waitUntil: 'domcontentloaded'
      })
      let computedLinkArr = await page.evaluate(() => {
        let resultArr = []
        for (let item of document.querySelectorAll('.info_song')) {
          const nameSong = item.querySelector('.name_song') && item.querySelector('.name_song').innerText
          if (nameSong) {
            resultArr.push({
              link: item.querySelector('a').href,
              name: nameSong,
              singer: item.querySelector('.name_singer').innerText
            })
          }
        }
        return resultArr
      })
      // Get lyrics
      for (let songObj of computedLinkArr) {
        console.log('songObj.link', songObj.link)
        await page.goto(songObj.link, {
          // waitUntil: 'domcontentloaded'
        })
        songObj.lyrics = await page.evaluate(() => {
          const lyricsHTML = document.querySelector('#divLyric')
          if (!(lyricsHTML && lyricsHTML.innerText)) {
            return ''
          }
          return lyricsHTML.innerText
        })
      }
      resultObj[musicType].songList = resultObj[musicType].songList.concat(computedLinkArr)
    }

  }
  // console.log('resultObj', JSON.stringify(resultObj, 2, 0))
  await fs.writeFileSync('data5.txt', JSON.stringify(resultObj, 2, 0))
  await browser.close();
})();