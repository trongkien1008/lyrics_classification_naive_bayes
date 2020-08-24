const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1800 });
  await page.goto('https://www.nhaccuatui.com/');
  // await browser.close();
})();