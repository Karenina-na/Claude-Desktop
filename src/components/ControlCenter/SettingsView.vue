<template>
  <div class="control-center-setting-container">
    <div class="control-center-setting-config-path">
    </div>
    <div class="control-center-setting-tabs-container">
      <el-tabs v-model="activeName" class="control-center-setting-tabs" @tab-click="handleClick">
        <el-tab-pane label="General" name="general">General</el-tab-pane>
        <el-tab-pane label="Main Window" name="mainWindow">Main Window</el-tab-pane>
        <el-tab-pane label="SystemTray Window" name="systemTrayWindow">SystemTray Window</el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { TabsPaneContext } from 'element-plus'


// active tab name
const activeName = ref('general')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab.props.name)
}

const path = window.electronAPI.getPath()
console.log(path)

</script>

<style scoped>
/* contains */
.control-center-container{
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  height: calc(100vh - 5px); /* auto height */
}

/* header */
.control-center-setting-config-path{
  margin: 10px 30px;
}
.control-center-setting-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
.control-center-setting-tabs-container{
  margin: 10px 30px;
}

</style>