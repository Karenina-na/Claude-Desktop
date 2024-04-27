<template>
    <el-container class="prompt-container">

      <!-- hidden aside -->
      <el-aside width="100px" class="prompt-aside">
        <el-scrollbar class="scrollbar">
          <el-tooltip v-for="(item, index) in history" :key="index"
                      placement="right">
            <template #content>
              {{item}}
            </template>
            <div
                type="primary" plain
                class="prompt-aside-item"
                @click="handleSelectHistory(item)"
            >
              <p class="prompt-aside-item-text">
                {{item}}
              </p>
            </div>
          </el-tooltip>
        </el-scrollbar>
      </el-aside>

      <el-container class="prompt-main-container">
        <!-- search -->
        <el-header class="prompt-header">
          <div class="prompt-header-title">
            PROMPT
          </div>
          <div class="prompt-header-search">
            <el-autocomplete
                v-model="state"
                :fetch-suggestions="querySearch"
                :trigger-on-focus="false"
                clearable
                placeholder="Please Input Prompt-Index"
                select-when-unmatched = True
                highlight-first-item = True
                popper-class = "prompt-search-popper"
                @select="handleSelect"
                autofocus = True
                :prefix-icon="Search"
                style="width: 70%"
            >
              <template #default="{ item }">
                <div class="prompt-search-popper">
                  <div class="prompt-search-popper-value">{{ item.value }}</div>
                  <div class="prompt-search-popper-link">{{ item.link }}</div>
                </div>
              </template>
            </el-autocomplete>
          </div>
        </el-header>

        <!-- display -->
        <el-main class="prompt-main">
          <el-scrollbar class="scrollbar">
            <!-- display -->
            <div class="prompt-display">
              {{display}}
              {{display}}
            </div>
          </el-scrollbar>
        </el-main>

        <el-footer class="prompt-footer">
          <!-- copy button -->
          <div style="width: 100%; display: flex; justify-content: right;">
            <div class="prompt-footer-button" @click="copyButton()" tabindex="0" v-on:keyup.enter="copyButton">
              Copy
            </div>
          </div>

          <!-- copy right -->
          <div class="copy-right">
            <p>
              <a href="https://github.com/Karenina-na/Claude-Desktop" target="_blank" >Claude Desktop</a>
              © 2023 Created by <a href="https://github.com/Karenina-na/" target="_blank">Karenina-na</a>
            </p>
          </div>
        </el-footer>
      </el-container>
    </el-container>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import {ElMessageBox} from "element-plus";

interface RestaurantItem {
  value: string
  link: string
}

// prompt
let prompt = ref(Array())
const restaurants = ref<RestaurantItem[]>([])
window.electronAPI.getPrompt().then((con : any)=> {
  // 将con从json转为 array[{CMD, ACT,RPOMPT,ENABLE}]
  let temp = Array()
  for (let i in con) {
    temp.push(con[i])
  }
  prompt.value = temp.filter((item) => {
    return item.ENABLE == true
  })
  restaurants.value = loadAll()
}, (err) => {
  console.log(err)
})
const loadAll = () => {
  return prompt.value.map((item) => {
    return { value: item.CMD, link: item.PROMPT }
  })
}

// query
const state = ref('')
const createFilter = (queryString: string) => {
  return (restaurant: RestaurantItem) => {
    return (
        restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    )
  }
}
const querySearch = (queryString: string, cb: any) => {
  const results = queryString
      ? restaurants.value.filter(createFilter(queryString))
      : restaurants.value
  // call callback function to return suggestions
  cb(results)
}
const handleSelect = (item: RestaurantItem) => {
  display.value = item.link
  // history.value.push(item.value)
  history.value.unshift(item.value)
}
const handleSelectHistory = (item: string) => {
  display.value = prompt.value.find((i) => i.CMD === item)?.PROMPT
  state.value = item
}

// display
let display = ref('')
let history = ref(Array(
    'english_translator_and_improver',
    'seo_prompt',
    'advertiser',
    'ai_assisted_doctor',
    'language_detector',
    'philosophy_teacher',
    'spoken_english_teacher_and_improver'
))

// copy
const copyButton = () => {
  navigator.clipboard.writeText(display.value).then(() => {
    // success msg
  }).catch(err => {
    // err msg
  })
}


</script>

<style scoped>
/* contains */
.prompt-container, .prompt-main-container, .prompt-header, .prompt-main, .prompt-footer{
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 0;
}

.prompt-container, prompt-aside, .prompt-main-container{
  height: calc(100vh - 10px); /* auto height */
}
/* scrollbar */
.scrollbar{
  width: 100%;
}

/* prompt aside */
.prompt-aside-item {
  cursor: pointer;
  user-select: none;
  border-radius: 6px;
  margin: 2px 0 0;
  padding-left: 4px;
  width: 90%;
  height: 30px;
  line-height: 30px;
  display: flex;
  align-items: center;
  justify-content: left;
}
.prompt-aside-item:hover{
  background-color: rgba(192, 192, 192, 0.5);
  transition: all 0.4s ease;
}
.prompt-aside-item:not(:hover) {
  background-color: initial;
  transition: all 0.4s ease;
}

.prompt-aside-item-text{
  width: 80px;
  font-size: 13px;
  font-weight: 400;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* search */
.prompt-header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
}

.prompt-header-title{
  font-size: 20px;
  font-weight: 600;
  padding: 0 10px;
  -webkit-user-select: none;
}

.prompt-header-search{
  -webkit-user-select: none;
  width: 100%;
}

.prompt-search-popper{
  -webkit-user-select: none;
  width: calc(100vw - 50px);
}

.prompt-search-popper-value{
  -webkit-user-select: none;
  font-size: 14px;
  font-weight: 400;
  margin: 0;
  padding: 0;
}

.prompt-search-popper-link{
  -webkit-user-select: none;
  font-size: 12px;
  font-weight: 400;
  margin: 0;
  padding: 0;
  color: rgba(107, 119, 140, 0.7);
}

/* prompt display */
.prompt-display{
  -webkit-user-select: none;
  text-align: left;
  width: 96%;
  height: 100%;
  font-size: 16px;
  font-weight: 400;
  overflow: auto;
  border: 1px solid #ebeef5;
  border-radius: 10px;
  padding: 5px;
}

/* prompt button*/
.prompt-footer-button{
  -webkit-user-select: none;
  cursor: pointer;
  user-select: none;
  border-radius: 6px;
  width: 60px;
  padding: 4px 4px 6px;
  margin: 4px 10% 4px 4px;
  border: 1px solid #d2d2d2;
}

.prompt-footer-button:hover{
  background-color: rgba(192, 192, 192, 0.5);
  transition: all 0.4s ease;
}
.prompt-footer-button:not(:hover) {
  background-color: initial;
  transition: all 0.4s ease;
}

/* copy-right */
.copy-right{
  -webkit-user-select: none;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #6b778c;
  font-size: 12px;
  font-weight: 600;
  margin: 0;
}

.copy-right p{
  margin: 0;
}

.copy-right a{
  color: #6DB3BC;
  text-decoration: none;
  margin: 0;
}

.copy-right a:hover{
  color: #4182f3;
  text-decoration: underline;
  margin: 0;
}

</style>