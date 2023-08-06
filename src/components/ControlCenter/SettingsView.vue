<template>
  <div class="control-center-setting-container">
    <div class="control-center-setting-config-path">
      Config Path: &nbsp;&nbsp;<span @click="openConfig()">{{ configPath }}</span>
    </div>
    <div class="control-center-setting-tabs-container">
      <el-tabs v-model="activeName" class="control-center-setting-tabs" @tab-click="handleClick">
        <el-tab-pane label="General" name="general">

          <!-- stay on top -->
          <div>
            <span>Stay On Top:</span>
            <el-switch
                v-model="config._stay_on_top"
                class="ml-2"
                style="--el-switch-on-color: rgba(19,206,102,0.6); --el-switch-off-color: rgba(255,73,73,0.6)"
            />
          </div>

          <!-- tray -->
          <div>
            <span>Enable Tray:</span>
            <el-switch
                v-model="config._tray"
                class="ml-2"
                style="--el-switch-on-color: rgba(19,206,102,0.6); --el-switch-off-color: rgba(255,73,73,0.6)"
            />
          </div>

          <!-- theme-->
          <div>
            <span>Theme:</span>
            <el-radio-group v-model="config._theme">
              <el-radio label="light" />
              <el-radio label="dark" />
              <el-radio label="system" />
            </el-radio-group>
          </div>

          <!-- agent -->
          <div>
            <span>User Agent:</span>
            <el-input
                v-model="config._ua_tray"
                autosize
                type="textarea"
                placeholder="User Agent"
                spellcheck="false"
            />
          </div>

          <!-- prompt path -->
          <div>
            <span>Prompt Path:</span>
            <el-input
                v-model="config._prompt_path"
                autosize
                type="textarea"
                placeholder="Prompt Path"
                spellcheck="false"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="Main Window" name="mainWindow">Main Window</el-tab-pane>
      </el-tabs>
      <div>
        <el-popconfirm
            width="240"
            confirm-button-text="OK"
            cancel-button-text="No, Thanks"
            icon-color="#67c23a"
            title="Are you sure to submit this?"
            @confirm="updateConfig"
        >
          <template #reference>
            <el-button type="success" plain>Submit</el-button>
          </template>
        </el-popconfirm>
        <el-button type="info" plain @click="clearConfig()">Cancel</el-button>
        <el-popconfirm
            width="280"
            confirm-button-text="OK"
            cancel-button-text="No, Thanks"
            icon-color="#e6a23c"
            title="Are you sure to reset to defaults?"
            @confirm="resetConfig"
        >
          <template #reference>
            <el-button type="warning" plain>Reset to defaults</el-button>
          </template>
        </el-popconfirm>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import {ElMessageBox} from "element-plus";


// active tab name
const activeName = ref('general')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab.props.name)
}

// config path
const configPath = ref('')
window.electronAPI.getConfigPath().then((path : any)=> {
  configPath.value = path.toString()
}, (err: Error) => {
  configPath.value = err.message
})

// config
const config = ref({})
window.electronAPI.getConfig().then((con : any)=> {
  config.value = con
}, (err: Error) => {
  config.value = undefined
})
function openConfig(){
  window.electronAPI.openConfig()
}
function updateConfig() {
  if (config.value === undefined) return
  const configClone = JSON.parse(JSON.stringify(config.value))
  window.electronAPI.updateConfig(configClone).then((result : any)=> {
    if (result=='ok'){
      ElMessageBox.alert(
          'Configuration saved successfully. Please restart the application to take effect.',
          'Notification',
          {
            confirmButtonText: 'OK',
            type: 'success',
          }
      ).then(() => {
        window.electronAPI.quit()
      })
    }
  }, (err: Error) => {
    ElMessageBox.alert(
        'Configuration saved failed. Please try again. error: ' + err.message,
        'Notification',
        {
          confirmButtonText: 'OK',
          type: 'error',
        }
    )
  })
}
function clearConfig(){
  window.electronAPI.getConfig().then((con : any)=> {
    config.value = con
  }, (err: Error) => {
    config.value = undefined
  })
}
function resetConfig(){
  window.electronAPI.resetConfig().then((result : any)=> {
    ElMessageBox.alert(
        'Configuration saved successfully. Please restart the application to take effect.',
        'Notification',
        {
          confirmButtonText: 'OK',
          type: 'success',
        }
    ).then(() => {
      window.electronAPI.quit()
    })
  }, (err: Error) => {
    ElMessageBox.alert(
        'Configuration saved failed. Please try again. error: ' + err.message,
        'Notification',
        {
          confirmButtonText: 'OK',
          type: 'error',
        }
    )
  })
}



</script>

<style scoped>
/* contains */
.control-center-setting-container{
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-user-select: none;
}

/* header */
.control-center-setting-config-path{
  margin: 8px 0 0 0;
  font-size: 14px;
  font-weight: 600;
}

.control-center-setting-config-path span{
  color: #6b778c;
}

.control-center-setting-config-path span:hover{
  color: #409eff;
  cursor: pointer;
}

.control-center-setting-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
.control-center-setting-tabs-container{
  margin: 0 30px;
}

</style>

//  翻译：完成control的general功能
// complete control general function