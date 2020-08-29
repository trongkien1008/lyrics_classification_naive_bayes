
const vntk = require('vntk')
const text = `em không là nàng thơ anh cũng không còn là nhạc sĩ mộng mơ`

console.log(vntk.wordTokenizer().tag(text, 'text').split(' '))