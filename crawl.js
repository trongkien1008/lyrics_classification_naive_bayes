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
    // headless: false
  });
  const page = await browser.newPage();
  
  // await page.setViewport({ width: 1200, height: 1800 });
  const MAX_SONG = 100
  let resultObj = {}
  for (let musicType in crawlData) {
    console.log('musicType', musicType)
    resultObj[musicType] = {
      songList: []
    }
    // Get list song link
    let countSongs = 0
    for (let i = 0; i < 15; i++) { // i < 5
      let link = `${crawlData[musicType].link.split('.html')[0]}${i ? '.' + i : ''}.html`
      await page.goto(link, {
        waitUntil: 'domcontentloaded'
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
          waitUntil: 'domcontentloaded'
        })
        songObj.lyrics = await page.evaluate(() => {
          const lyricsHTML = document.querySelector('#divLyric')
          let lyrics = lyricsHTML && lyricsHTML.innerText
          if (!lyrics || (lyrics && lyrics.includes('Hiện chưa có lời bài hát'))) {
            return ''
          }
          return lyricsHTML.innerText
        })
        if (songObj.lyrics) {
          countSongs++
        }
        if (countSongs === MAX_SONG) {
          break
        }
      }
      computedLinkArr = computedLinkArr.filter(songObj => songObj.lyrics)
      resultObj[musicType].songList = resultObj[musicType].songList.concat(computedLinkArr)
      if (countSongs === MAX_SONG) {
        break
      }
    }
  }
  // console.log('resultObj', JSON.stringify(resultObj, 2, 0))
  await fs.writeFileSync('data/datacm.json', JSON.stringify(resultObj, 2, 0))
  await browser.close();
})();