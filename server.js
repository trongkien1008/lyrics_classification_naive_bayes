const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000
const helpers = require('./helpers')

app.use(cors())

const classifer = require('./classifer.js')

app.get('/', function (req, res) {
  let result
  if (req.query.title) {
    console.log('req.query.title', req.query.title)
    let titleStr = helpers.handleString(req.query.title)
    console.log('titleStr', titleStr)
    if (titleStr) {
      result = classifer.classify(titleStr)
      console.log('result', result)
    }
  }
  res.send({
    title: req.query.title,
    predict: result
  })
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))