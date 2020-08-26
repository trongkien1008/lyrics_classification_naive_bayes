
const vntk = require('vntk')
const wordTokenizer = vntk.wordTokenizer()
const stopwords = require('vietnamese-stopwords');
const removePunctuation = require('remove-punctuation');

const handleString = (str) => {
  const strTokenizer = wordTokenizer
    .tag(removePunctuation(str).replace(/-|‘|’|“|”/g, ''), 'text')
    .toLowerCase()
    .split(' ')
    .filter(val => !stopwords.includes(val))

  return strTokenizer.filter(val => isNaN(val)).join(' ')
}


module.exports = {
  handleString
}