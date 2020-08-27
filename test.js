// const fs = require('fs')
// const vntk = require('vntk')
// const wordTokenizer = vntk.wordTokenizer()
// const stopwords = require('vietnamese-stopwords');
// const removePunctuation = require('remove-punctuation');


// const handleString = (str) => {
//   return wordTokenizer
//     .tag(removePunctuation(str).replace(/-|‘|’|“|”/g, ''), 'text')
//     .toLowerCase()
//     .split(' ')
//     .filter(val => !stopwords.includes(val) && isNaN(val))
//     .join(' ')
// }

// console.log(handleString('Vì Ai - Ngọt\n\nBao năm bôn ba từng *** sống đơn côi\nNay thân anh hao gầy ăn mãi không trôi vì ai ngoài em\nLênh đênh lênh đênh vượt bão tố phong ba\nĐêm đêm anh ôm đàn, sáng sớm anh ra ngoài hiên chờ em\nChờ ai ngoài em\n\nCó lẽ em đang rất gần, thế nhưng anh không thấy em\nVì sau bao khó khăn cũng đâu có ý ngĩa gì\nCó lẽ anh nên quay về để em yên trong kiếp này\nHẹn gặp em kiếp sau biết đâu sẽ đẹp đôi hơn\n\nLang thang lang thang mình anh giữa ban trưa\nQuên mang theo ô mình anh dưới cơn mưa tìm ai ngoài em\nQuán nước nơi anh ngồi hai tiếng trông mong\nHai chai'))
const { uniqBy } = require('lodash')

// check duplicate
let data = require('./data/data100.json')
for (let key in data) {
  console.log('data[key].songList.length_before', data[key].songList.length)
  let uniqSongList = uniqBy(data[key].songList, 'name')
  console.log('uniqSongList.length_after', uniqSongList.length)
}
// console.log('data', Object.keys(data))