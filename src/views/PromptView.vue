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
            <el-button
                       type="primary" plain
                       class="prompt-aside-item"
                       @click="handleSelectHistory(item)"
            >
              <p class="prompt-aside-item-text">
                {{item}}
              </p>
            </el-button>
          </el-tooltip>
        </el-scrollbar>
      </el-aside>

      <el-container class="prompt-main-container">
        <!-- search -->
        <el-header class="prompt-header">
          <div>
            <div>
              list suggestions on input
            </div>
            <el-autocomplete
                v-model="state"
                :fetch-suggestions="querySearch"
                :trigger-on-focus="false"
                clearable
                class="inline-input w-50"
                placeholder="Please Input"
                @select="handleSelect"
            />
          </div>
        </el-header>

        <!-- display -->
        <el-main class="prompt-main">
          <el-scrollbar class="scrollbar">
            <!-- display -->
            <div class="prompt-display">
              {{display}}
            </div>
          </el-scrollbar>
        </el-main>

        <el-footer class="prompt-footer">
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


</script>

<style scoped>
/* contains */
.prompt-container, .prompt-main-container, .prompt-header, .prompt-main, .prompt-footer{
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 0;
}

.prompt-container, prompt-aside, .prompt-main-container{
  height: calc(100vh - 5px); /* auto height */
}

/* scrollbar */
.scrollbar{
  width: 100%;
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
}

.copy-right a{
  color: #6DB3BC;
  text-decoration: none;
}

.copy-right a:hover{
  color: #4182f3;
  text-decoration: underline;
}

/* prompt aside */
.prompt-aside-item {
  margin: 2px 0 0;
  width: 100%;
  height: 30px;
  line-height: 30px;
  display: flex;
  align-items: center;
  justify-content: left;
}

.prompt-aside-item-text{
  width: 80px;
  font-size: 13px;
  font-weight: 100;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>