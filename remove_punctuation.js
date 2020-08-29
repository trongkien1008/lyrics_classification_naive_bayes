const vietnameseStopwords = require('vietnamese-stopwords')

// `Em không là - ^ $ # 1 2 3 Nàng thơ Anh %$# cũng không còn là nhạc sĩ mộng mơ !!!!`

// `Em không là Nàng thơ Anh cũng không còn là nhạc sĩ mộng mơ`

// `em không là nàng thơ anh cũng không còn là nhạc sĩ mộng mơ`

console.log(
    [
        'em',      'không',
        'là',      'nàng_thơ',
        'anh',     'cũng',
        'không',   'còn',
        'là',      'nhạc_sĩ',
        'mộng_mơ'
    ]
    .filter(word => !vietnameseStopwords.includes(word))
)


// console.log(removePunctuation(text).replace(/-|‘|’|“|”/g, ''))