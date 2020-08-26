const fs = require('fs')
const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000
const helpers = require('./helpers')

app.use(cors())
app.use(express.json({ type: ['application/json', 'application/csp-report'] }));

const classifer = require('./classifer.js')

app.post('/predict', function (req, res) {
  try {
    console.log('req', req.body)
    let result
    if (req.body.text) {
      console.log('req.body.text', req.body.text)
      let titleStr = helpers.handleString(req.body.text)
      console.log('titleStr', titleStr)
      if (titleStr) {
        result = classifer.classify(titleStr)
      } else {
        result = 'Không có kết quả.'
      }
      console.log('result', result)
    }
    res.send({
      title: req.body.text,
      predict: result
    })
  } catch (error) {
    throw new Error(error)
  }
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))