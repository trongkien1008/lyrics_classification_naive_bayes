const fs = require('fs')
const data = require('./data.json')
const helpers = require('./helpers')

const main = async () => {
  const trainDataImport = Object.keys(data).reduce((resultObj, musicType) => {
    console.log('musicType', musicType)
    resultObj[musicType] = data[musicType].songList.map(songObj => {
      console.log('songName', songObj.name)
      return helpers.handleString(songObj.lyrics)
    }).join(' ')
    return resultObj
  }, {})
  await fs.writeFileSync('data/processed_data.json', JSON.stringify(trainDataImport, 2, 0))
}

main()
