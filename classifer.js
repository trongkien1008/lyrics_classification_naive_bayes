const WhichX = require("./whichx_updated")

//WHICHX
const classifer = new WhichX()


// train
// const trainData = require('./data/processed_data1.json')

// classifer.addLabels(Object.keys(trainData))
// for (const key in trainData) {
//   classifer.addData(key, trainData[key])
// }

// export bag of words
// fs.writeFileSync('data/bag_of_words.json', JSON.stringify(classifer.export(), 2, 0))

// import bag of words for optimize performant
const bow = require('./data/bag_of_words.json')
classifer.import(bow)

module.exports = classifer