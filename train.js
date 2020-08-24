const WhichX = require("whichx")

//WHICHX
const classifer = new WhichX()

//TOTAL - data training.
trainData = {
  //1
  'nhạc trẻ': 'nhạc trẻ',
  //2
  'nhạc trữ tình': 'nhạc trữ tình',
  //3
  'nhạc trịnh': 'nhạc trịnh',
  //4
  'nhạc cách mạng': 'nhạc cách mạng',
  //5
  'rock việt': 'rock việt'
}

classifer.addLabels(Object.keys(trainData))
for (const key in trainData) {
  classifer.addData(key, trainData[key])
}

module.exports = classifer