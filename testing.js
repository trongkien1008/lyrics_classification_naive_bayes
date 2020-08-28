const fs = require('fs')
const classifer = require('./classifer.js')

const dataTesting = require('./data/data_test_30.json')

const resultTesting = {}
const helpers = require('./helpers')

for (let typeName in dataTesting) {
  resultTesting[typeName] = {}
  for (let songObj of dataTesting[typeName].songList) {
    console.log('songObj.name', songObj.name)
    let lyricStr = helpers.handleString(songObj.lyrics.substring(0, 100))
    // console.log('lyricStr', lyricStr)
    let result = 'None'
    if (lyricStr) {
      result = classifer.classify(lyricStr)
    }
    resultTesting[typeName][result] = resultTesting[typeName][result] || []
    resultTesting[typeName][result].push(songObj)
  }
}

fs.writeFileSync('data/tests/result1.json', JSON.stringify(resultTesting, 2, 0))
