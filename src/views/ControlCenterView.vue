<template>
  <div class="control-center-container">
    <el-container>
      <el-aside width="200px">
        asdfasdfasdf
      </el-aside>
      <el-main>
        asdfasdfasdf
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">

console.log(window.electronAPI.config())

</script>

<style>
.control-center-container {
  align-items: center;
  justify-content: center;
  height: calc(100vh - 5px);  /* auto height */
  width: 100%;
  background-color: rgb(239 237 230);
}
</style>
