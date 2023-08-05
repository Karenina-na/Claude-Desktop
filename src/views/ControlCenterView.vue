<template>
  <div class="control-center-container">
    <el-container>
      <el-aside :width="asideWidth" class="control-aside">
        <el-container class="control-aside-container">
          <el-scrollbar class="scrollbar">

            <div style="height: 106px;">
              <!-- logo -->
              <div class="control-aside-div">
                <img src="@/assets/logo.png" alt="logo" style="width: 40px; height: 40px;"/>
              </div>

              <!-- name -->
              <div class="control-aside-div">
                <p class="control-aside-title">Claude</p>
                <p class="control-aside-title">{{version}}</p>
              </div>

              <!-- star -->
              <Transition name="star">
                <div v-if="!isCollapsed" class="control-aside-div">
                  <el-rate v-model="star" :colors="colors" @change="changeStar()"/>
                </div>
              </Transition>
            </div>

            <!-- collapse -->
            <div class="control-aside-div control-aside-choice" @click="isCollapsed = !isCollapsed;asideWidth=isCollapsed?'80px':'200px';">
                <el-icon :size="20"  v-if="!isCollapsed"><i-ep-d-arrow-left/></el-icon>
                <el-icon :size="20"  v-if="isCollapsed"><i-ep-d-arrow-right/></el-icon>
            </div>

            <!-- settings -->
            <div class="control-aside-div control-aside-item" :class="{
              'control-aside-item-not-choice': choice !== 'settings',
              'control-aside-item-choice': choice === 'settings',
            }" @click="choiceItem('settings')">
              <el-icon :size="isCollapsed ? '20px' : '16px'" style="transition: all 0.3s"><i-ep-setting/></el-icon>
                <Transition name="iconP">
                  <p v-if="!isCollapsed" class="control-aside-icon">Settings</p>
                </Transition>
            </div>

            <!-- prompts -->
            <div class="control-aside-div control-aside-item" :class="{
              'control-aside-item-not-choice': choice !== 'prompts',
              'control-aside-item-choice': choice === 'prompts',
            }" @click="choiceItem('prompts')">
              <el-icon :size="isCollapsed ? '20px' : '16px'" style="transition: all 0.3s"><i-ep-magic-stick/></el-icon>
                <Transition name="iconP">
                  <p v-if="!isCollapsed" class="control-aside-icon">Prompts</p>
                </Transition>
            </div>

            <!-- notes -->
            <div class="control-aside-div control-aside-item" :class="{
              'control-aside-item-not-choice': choice !== 'notes',
              'control-aside-item-choice': choice === 'notes',
            }" @click="choiceItem('notes')">
              <el-icon :size="isCollapsed ? '20px' : '16px'" style="transition: all 0.3s"><i-ep-edit/></el-icon>
                <Transition name="iconP">
                  <p v-if="!isCollapsed" class="control-aside-icon">Notes</p>
                </Transition>
            </div>

            <!-- about -->
            <div class="control-aside-div control-aside-item" :class="{
              'control-aside-item-not-choice': choice !== 'about',
              'control-aside-item-choice': choice === 'about',
            }" @click="choiceItem('about')">
              <el-icon :size="isCollapsed ? '20px' : '16px'" style="transition: all 0.3s"><i-ep-warning/></el-icon>
              <Transition name="iconP">
                <p v-if="!isCollapsed" class="control-aside-icon">about</p>
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
import { version, author } from '../../package.json'
import {ref} from 'vue'

const isCollapsed = ref(false)
let asideWidth = ref('200px')

const colors = ref(['#99A9BF', '#F7BA2A', '#FF9900'])
const star = ref(0)

// star
function changeStar(){
  console.log(star.value)
}

// settings prompts notes about
let choice = ref('settings')

// choice
function choiceItem(value:string){
  choice.value = value
  console.log(choice.value)
}

</script>

<style>
/* contains */
.control-center-container, .control-aside-container, .control-center-main-container{
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  height: calc(100vh - 5px); /* auto height */
}

.control-aside{
  transition: all 0.4s ease;
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
  user-select: none;
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
  font-size: 15px;
  font-weight: 100;
  padding-right: 10px;
  padding-bottom: 3px;
  transition: all 0.3s;
}

.control-aside-choice{
  cursor: pointer;
  user-select: none;
  height: 40px;
  align-items: center;
  border-radius: 6px;
  border: 1px solid #d2d2d2;
  transition: all 0.3s;
}

.control-aside-item{
  cursor: pointer;
  user-select: none;
  height: 40px;
  align-items: center;
  border-radius: 6px;
}

.control-aside-item-not-choice:hover{
  background-color: rgba(192, 192, 192, 0.5);
  transition: all 0.4s ease;
}
.control-aside-item-not-choice:not(:hover) {
  background-color: initial;
  transition: all 0.4s ease;
}

.control-aside-item-choice{
  background-color: rgba(238, 177, 79, 0.5);
  transition: all 0.4s ease;
}

.iconP-enter-active, .iconP-leave-active {
  transition: all 0.3s ease 0.1s;
}
.iconP-enter-from, .iconP-leave-to {
  transform: translateX(20px);
  transition: all 0.3s ease 0.1s;
  width: 0;
  margin: 0;
  padding: 0;
  opacity: 0;
}

.star-enter-active, .star-leave-active{
  transition: all 0.3s ease 0.1s;
}
.star-enter-from, .star-leave-to{
  transition: all 0.1s ease 0s;
  opacity: 0;
}
</style>
