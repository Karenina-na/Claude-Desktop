<template>
  <el-scrollbar class="scrollbar">
    <RouterView/>
  </el-scrollbar>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

html,
body,
#app {
  height: 100%;
  width: 100%;
}

/* scrollbar */
.scrollbar {
  align-items: center;
  justify-content: center;
  height: calc(100vh - 5px);  /* auto height */
  margin: 0;
  padding: 0;
  text-align: center;
  border-radius: 4px;
}
</style>
