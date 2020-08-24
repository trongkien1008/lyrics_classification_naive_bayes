const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000
const vntk = require('vntk')
const wordTokenizer = vntk.wordTokenizer()
const stopwords = require('vietnamese-stopwords');
const removePunctuation = require('remove-punctuation');

app.use(cors())

const classifer = require('./train.js')

console.log('classifer', classifer)

app.get('/', function (req, res) {
  let result
  if (req.query.title) {
    console.log('req.query.title', req.query.title)
    let handling_strings = wordTokenizer
      .tag(removePunctuation(req.query.title)
      .replace(/-|‘|’|“|”/g, ''), 'text').toLowerCase()
      .split(' ')
      .filter(val => !stopwords.includes(val))
      .join(' ')

    let parse_string = handling_strings.split(' ');
    let get_number = parse_string.map(e => { if (isNaN(e) === false) { return e } });
    let filter_NaN = parse_string.filter(val => !get_number.includes(val))
    let join_element_array = filter_NaN.join(' ')
    console.log('join_element_array', join_element_array)
    if (join_element_array) {
      result = classifer.classify(join_element_array)
    }
  }
  res.send({
    title: req.query.title,
    predict: result
  })
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))