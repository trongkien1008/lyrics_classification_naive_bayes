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
          <v-text-field v-model="keywordSong" placeholder="Tìm kiếm bài hát (bằng tên, nhạc sĩ, lời)..." label="Tìm kiếm" />
          <v-autocomplete v-model="filterSong" placeholder="Thể loại" label="Chọn Thể loại" :items="typesNameSongs" clearable />
          <v-data-table
            :search="keywordSong"
            :headers="headersSongs"
            :items="listSongs"
            :items-per-page="50"
            class="elevation-1"
            @click:row="gotoLink"
          />
        </template>
        <template v-else-if="currentPage === 'bow'">
          <v-layout class="justify-space-between">
            <h2>Túi đựng từ (Bag of Words)</h2>
            <v-btn @click.stop="showSastify = !showSastify">Hiện thống kê</v-btn>
          </v-layout>
          <template v-if="showSastify">
            <h3>Thống kê sương sương</h3>
            <h4>Số label: {{ totalLabel }}</h4>
              <v-data-table
                :headers="headerSastify"
                :items="sastifyBOW"
                class="elevation-1"
              />
          </template>
          <v-text-field v-model="keywordBow" placeholder="Tìm kiếm từ..." label="Tìm kiếm" />
          <v-autocomplete v-model="filterBow" placeholder="Thể loại" label="Chọn Thể loại" :items="typesNameBOW" clearable />


          <v-data-table
            :search="keywordBow"
            :headers="headersBow"
            :items="bagOfWords"
            :items-per-page="50"
            class="elevation-1"
          />
        </template>
        <template v-else-if="currentPage === 'about'">
          <h2>About</h2>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. là lá la lala.</p>
          <p>Đây là bài <b>Phân thể loại bài hát</b> dựa trên <strong>Naive Bayes</strong> được làm bởi nhóm của Thắng và Kiên</p>
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
</style>

<script>
import allData from '../../data/data100.json'
import dataBagOfWords from '../../data/bag_of_words100.json'
import Axios from 'axios'

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
      headersSongs: [
        {
          text: 'Tên',
          value: 'name',
        },
        {
          text: 'Thể loại',
          value: 'typeName',
        },
        { text: 'Thể hiện', value: 'singer' },
        { text: 'Link', value: 'link' },
      ],
      headerSastify: [
        {
          text: 'Thể loại',
          value: 'typeName',
        },
        {
          text: 'Tổng cộng',
          value: 'total',
        }
      ],
      headersBow: [
        {
          text: 'Từ',
          sortable: false,
          value: 'word',
        },
        { text: 'Tần số', value: 'total' },
        { text: 'Thể loại', value: 'typeName' },
      ],
      color: 'primary',
      currentPage: 'dashboard',
      result: '',
      predictText: '',
      keywordSong: '',
      keywordBow: '',
      filterSong: '',
      filterBow: '',
      showSastify: false
    }
  },
  computed: {
    typesNameSongs () {
      return Object.keys(Object.assign({}, allData))
    },
    typesNameBOW () {
      return Object.keys(Object.assign({}, dataBagOfWords))
    },
    listSongs () {
      return Object.keys(Object.assign({}, allData)).reduce((resultArr, typeName) => {
        if (this.filterSong && this.filterSong !== typeName) {
          return resultArr
        }
        return [ ...resultArr, ...allData[typeName].songList.map(e => ({...e, typeName})) ]
      }, [])
    },
    bagOfWords () {
      return Object.keys(Object.assign({}, dataBagOfWords)).reduce((resultArr, typeName) => {
        if (this.filterBow && this.filterBow !== typeName) {
          return resultArr
        }
        return [ ...resultArr, ...Object.keys(dataBagOfWords[typeName]).reduce((resultArr, word) => {
          if (!['tcount', 'wordTotal'].includes(word)) {
            resultArr.push({
              typeName,
              word,
              total: dataBagOfWords[typeName][word]
            })
          }
          return resultArr
        }, []) ]
      }, [])
    },
    totalLabel () {
      return dataBagOfWords.total.tcount
    },
    sastifyBOW () {
      return Object.keys(dataBagOfWords).reduce((resultArr, typeName) => {
        const info = {
          typeName,
          total: dataBagOfWords[typeName].wordTotal
        }
        resultArr.push(info)
        return resultArr
      }, [])
    }
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
    gotoLink (e) {
      window.open(e.link)
    }
  }
}
</script>