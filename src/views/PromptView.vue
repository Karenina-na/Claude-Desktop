<template>
  <div class="prompt-container">
    <el-container>
      <el-header class="prompt-header">
        <el-container>
          Search
        </el-container>
      </el-header>

      <el-container>
        <el-aside width="120px" class="prompt-aside">
          <el-container class="control-aside-container">
            History of Prompt
          </el-container>
          <el-scrollbar class="scrollbar">
            history
          </el-scrollbar>
        </el-aside>

        <el-main class="prompt-main-container">
          <el-scrollbar class="scrollbar">
            prompt-row
          </el-scrollbar>
        </el-main>

        <el-footer class="prompt-footer-container">
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
  </div>
</template>

<script lang="ts" setup>

// prompt
let prompt = ref(Array())
window.electronAPI.getPrompt().then((con : any)=> {
  // 将con从json转为 array[{CMD, ACT,RPOMPT,ENABLE}]
  let temp = Array()
  for (let i in con) {
    temp.push(con[i])
  }
  prompt.value = temp.filter((item) => {
    return item.ENABLE == true
  })
}, (err) => {
  console.log(err)
})

</script>

<style scoped>
/* contains */
.prompt-container, .prompt-header, .prompt-aside, .prompt-main-container, .prompt-footer-container{
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 0;
}

.prompt-container{
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
</style>