<template>
  <v-app>
    <v-layout fill-height>
      <v-btn v-if="!drawer" @click.stop="drawer = true">Show Drawer</v-btn>
      <v-navigation-drawer
        v-else
        v-model="drawer"
        class="main-drawer"
        :color="color"
        dark
      >
        <v-list
          dense
          nav
          class="py-0"
        >
          <v-list-item two-line>
            <v-list-item-content>
              <h3>Lyrics Classification</h3>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item
            v-for="item in items"
            @click="currentPage = item.value"
            :key="item.title"
            link
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <div class="pa-4">
        <template v-if="currentPage === 'dashboard'">
          <h2>Trang chủ</h2>
          <h4>Đoán thể loại:</h4>
          <v-textarea v-model="predictText" placeholder="Nhập lời bài hát..." label="Lời bài hát" @keydown.enter="doPredict" />
          <v-btn @click="doPredict">Dự đoán</v-btn>
          <div class="mt-5">
            <h4>Kết quả:</h4>
            {{ result }}
          </div>
        </template>
        <template v-else-if="currentPage === 'list'">
          <h2>Danh sách bài hát</h2>
          <v-layout>
            <v-text-field v-model="keyword" placeholder="Tìm kiếm bài hát (bằng tên, nhạc sĩ, lời)..." label="Tìm kiếm" @keydown.enter="doSearch" />
            <v-btn class="mr-2" @click="doSearch">Tìm</v-btn>
            <v-btn @click="doCancel">Hủy</v-btn>
          </v-layout>

          <v-layout wrap>
            <v-flex v-for="(typeObj, tIndex) in allDataArr" :key="`type-${tIndex}`" xs2 pr-2>
              <h4>Thể loại: {{ typeObj.typeName }}</h4>
              <div v-for="(songObj, sIndex) in typeObj.songList" :key="`type-${tIndex}-song-${sIndex}`" class="song-item py-1">
                 <a @click.stop="gotoLink(songObj.link)">{{ songObj.name }} - {{ songObj.singer }}</a>
              </div>
            </v-flex>
          </v-layout>
        </template>
        <template v-else-if="currentPage === 'bow'">
          <h2>Túi đựng từ (Bag of Words)</h2>
          <v-layout column>
            <v-flex v-for="(typeObj, tIndex) in bagOfWords" :key="`type-${tIndex}`" class="mt-4">
              <v-layout justify-space-between="">
                <h4>Thể loại: {{ typeObj.typeName }}</h4>
                <p>Tổng số từ: {{ typeObj.wordTotal }}</p>
              </v-layout>
              <v-data-table
                :headers="headers"
                :items="typeObj.words"
                :items-per-page="5"
                class="elevation-1"
              />
            </v-flex>
          </v-layout>
        </template>
        <template v-else-if="currentPage === 'about'">
          <h2>About</h2>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem, laudantium consequuntur! Sint adipisci suscipit accusantium accusamus est eos nostrum cumque consectetur, aperiam mollitia provident rerum nobis inventore nesciunt voluptate eum.</p>
        </template>
      </div>
    </v-layout>
  </v-app>
</template>

<style>
.main-drawer {
  min-width: 256px !important;
  max-width: 256px !important;
}
.song-item {
  border-bottom: 1px solid #eee;
}

.song-item a:hover {
  text-decoration: underline;
}
</style>

<script>
import allData from '../../data/data100.json'
import bagOfWords from '../../data/bag_of_words100.json'
import Axios from 'axios'

const allDataArr = Object.keys(Object.assign({}, allData)).map(typeName => ({
  typeName,
  songList: allData[typeName].songList
}))

export default {
  data () {
    return {
      drawer: true,
      items: [
        { title: 'Trang chủ', value: 'dashboard', icon: 'mdi-view-dashboard' },
        { title: 'Danh sách', value: 'list', icon: 'mdi-format-list-bulleted' },
        { title: 'Túi đựng từ', value: 'bow', icon: 'mdi-format-list-bulleted' },
        { title: 'About', value: 'about', icon: 'mdi-help-box' },
      ],
      headers: [
        {
          text: 'Từ',
          sortable: false,
          value: 'word',
        },
        { text: 'Tần số', value: 'total' },
      ],
      color: 'primary',
      allDataArr: Object.assign({}, allDataArr),
      bagOfWords: Object.keys(Object.assign({}, bagOfWords)).map((typeName) => ({
        typeName,
        wordTotal: bagOfWords[typeName].wordTotal,
        words: Object.keys(bagOfWords[typeName]).reduce((resultArr, word) => {
          if (!['tcount', 'wordTotal'].includes(word)) {
            resultArr.push({
              word,
              total: bagOfWords[typeName][word]
            })
          }
          return resultArr
        }, [])
      })),
      currentPage: 'dashboard',
      result: '',
      predictText: '',
      keyword: ''
    }
  },
  computed: {
  },
  methods: {
    async doPredict () {
      if (this.predictText) {
        try {
          const { data } = await Axios.post('http://localhost:3000/predict', { text: this.predictText }, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          })
          this.result = data.predict
        } catch (error) {
          console.log(error)        
        }
      }
    },
    doSearch () {
      let re = new RegExp(this.keyword, 'gmi')
      this.allDataArr = allDataArr.reduce((resultArr, typeObj) => {
        typeObj.songList = typeObj.songList.filter(e => e.name.match(re) || e.singer.match(re) || e.lyrics.match(re))
        if (typeObj.typeName.match(re) || typeObj.songList.length) {
          resultArr.push(typeObj)
        }
        return resultArr
      }, [])
    },
    doCancel () {
      this.allDataArr = allDataArr
    },
    gotoLink (link) {
      window.open(link)
    }
  }
}
</script>