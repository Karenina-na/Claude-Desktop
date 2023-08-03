<template>
  <div class="control-center-container">
    <el-container>
      <el-aside :width="asideWidth" class="control-aside">
        <el-container class="control-aside-container">
          <el-scrollbar class="scrollbar">

            <!-- logo -->
            <div class="control-aside-div">
              <img src="@/assets/logo.png" alt="logo" style="width: 40px; height: 40px;"/>
            </div>
            <div class="control-aside-div">
              <p class="control-aside-title">Claude</p>
              <p class="control-aside-title">{{version}}</p>
            </div>

            <!-- collapse -->
            <div class="control-aside-div control-aside-choice" @click="isCollapsed = !isCollapsed;asideWidth=isCollapsed?'80px':'200px';">
                <el-icon :size="20"  v-if="!isCollapsed"><i-ep-d-arrow-left/></el-icon>
                <el-icon :size="20"  v-if="isCollapsed"><i-ep-d-arrow-right/></el-icon>
            </div>

            <!-- setting -->
            <div class="control-aside-div control-aside-item">
              <el-icon :size="20"><i-ep-setting/></el-icon>
                <Transition name="iconP">
                  <p v-if="!isCollapsed" class="control-aside-icon">Settings</p>
                </Transition>
            </div>

          </el-scrollbar>
      </el-container>
      </el-aside>
        <el-main class="control-center-main-container">
          <el-scrollbar class="scrollbar">
            asdfasdfasdf
          </el-scrollbar>
        </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { version } from '../../package.json'
import {ref} from 'vue'

const isCollapsed = ref(false)
let asideWidth = ref('80px')
</script>

<style>
/* contains */
.control-center-container, .control-aside-container, .control-center-main-container{
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  height: calc(100vh - 5px); /* auto height */
}

.control-aside{
  transition: all 0.3s ease;
}

.control-aside-container{
  background-color: rgb(229, 229, 229);
}

/* scrollbar */
.scrollbar{
  width: 100%;
}

/* control div */
.control-aside-div{
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 5px;
}

.control-aside-div .control-aside-title{
  user-select: none;
  margin: 4px 4px 0;
  width: 60px;
  font-size: 15px;
  font-weight: 400;
  border: 1px solid #9b9b9b;
  border-radius: 6px;
}

/* aside */
.control-aside-icon{
  margin: 0 0 0 8px;
  font-size: 14px;
  font-weight: 100;
}

.control-aside-choice{
  cursor: pointer;
  user-select: none;
  height: 40px;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  border: 1px solid #d2d2d2;
}

.control-aside-item{
  cursor: pointer;
  user-select: none;
  height: 40px;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
}

.control-aside-item:hover{
  background-color: #c0c0c0;
  transition: all 0.5s ease;
}
.control-aside-item:not(:hover) {
  background-color: initial;
  transition: all 0.5s ease;
}

.iconP-enter-active, .iconP-leave-active {
  transition: all 0.3s ease;
}
.iconP-enter-from, .iconP-leave-to {
  transform: translateX(20px);
  width: 0;
  margin: 0;
  opacity: 0;
}
</style>
