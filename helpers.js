
const vntk = require('vntk')
const wordTokenizer = vntk.wordTokenizer()
const stopwords = require('vietnamese-stopwords');
const removePunctuation = require('remove-punctuation');

const handleString = (str) => {
  return wordTokenizer
    .tag(removePunctuation(str).replace(/-|‘|’|“|”/g, ''), 'text')
    .toLowerCase()
    .split(' ')
    .filter(val => ![...stopwords, 'x2', 'x4'].includes(val) && isNaN(val))
    .join(' ')
}


module.exports = {
  handleString
}