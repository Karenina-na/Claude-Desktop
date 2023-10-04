<template>
  <div class="control-center-setting-container">
    <div class="control-center-setting-config-path">
      Config Path: &nbsp;&nbsp;<span @click="openConfig()">{{ configPath }}</span>
    </div>
    <div class="control-center-setting-tabs-container">
      <el-tabs v-model="activeName" class="control-center-setting-tabs" @tab-click="handleClick">
        <el-tab-pane label="General" name="general">

          <!-- stay on top -->
          <div class="control-center-setting-items">
            <span>Stay On Top:</span>
            <el-switch
                class="control-center-setting-items-value"
                v-model="config._stay_on_top"
                style="--el-switch-on-color: rgba(19,206,102,0.6); --el-switch-off-color: rgba(255,73,73,0.6)"
            />
          </div>

          <!-- tray -->
          <div class="control-center-setting-items">
            <span>Enable Tray:</span>
            <el-switch
                v-model="config._tray"
                class="control-center-setting-items-value"
                style="--el-switch-on-color: rgba(19,206,102,0.6); --el-switch-off-color: rgba(255,73,73,0.6)"
            />
          </div>

          <!-- theme-->
          <div class="control-center-setting-items">
            <span>Theme:</span>
            <el-radio-group v-model="config._theme" class="control-center-setting-items-value">
              <el-radio label="light" style="scale: 1.1;"/>
              <el-radio label="dark" style="scale: 1.1;"/>
              <el-radio label="system" style="scale: 1.1;"/>
            </el-radio-group>
          </div>

          <!-- agent -->
          <div class="control-center-setting-items">
            <span>User Agent:</span>
            <el-input
                v-model="config._ua_tray"
                class="control-center-setting-items-value"
                :autosize="{ minRows: 2, maxRows: 4 }"
                type="textarea"
                placeholder="User Agent"
                spellcheck="false"
                style="width: 350px;"
            />
          </div>

          <!-- prompt path -->
          <div class="control-center-setting-items">
            <span>Prompt Path:</span>
            <el-input
                v-model="config._prompt_path"
                class="control-center-setting-items-value"
                autosize
                placeholder="Prompt Path"
                spellcheck="false"
                style="width: 350px;"
            />
          </div>
        </el-tab-pane>

        <el-tab-pane label="Main Window" name="mainWindow">
          <!-- default width -->
          <div class="control-center-setting-items">
            <span>Default Width:</span>
            <el-input-number
                v-model="config._main_width"
                class="control-center-setting-items-value"
                controls-position="right"
                :min="0"
                :max="9999"
                :step="1"
                style="width: 100px;"
            />
          </div>

          <!-- default height -->
          <div class="control-center-setting-items">
            <span>Default Height:</span>
            <el-input-number
                v-model="config._main_height"
                class="control-center-setting-items-value"
                controls-position="right"
                :min="0"
                :max="9999"
                :step="1"
                style="width: 100px;"
            />
          </div>



        </el-tab-pane>

        <el-tab-pane label="Update" name="Update">
          <!-- auto update -->
          <div class="control-center-setting-items">
            <span>Auto Update:</span>
            <el-switch
                v-model="updateInfo.auto"
                class="control-center-setting-items-value"
                style="--el-switch-on-color: rgba(19,206,102,0.6); --el-switch-off-color: rgba(255,73,73,0.6)"
            />
          </div>

          <!-- skip next version -->
          <div class="control-center-setting-items">
            <span>Skip Next Version:</span>
            <el-switch
                v-model="updateInfo.skip"
                class="control-center-setting-items-value"
                style="--el-switch-on-color: rgba(19,206,102,0.6); --el-switch-off-color: rgba(255,73,73,0.6)"
            />
          </div>

          <!-- current version -->
          <div class="control-center-setting-items">
            <span>Current Version:</span>
            <div class="control-center-setting-items-value" style="width:40px">{{ updateInfo.version }}</div>
          </div>
        </el-tab-pane>
      </el-tabs>

      <div class="control-center-setting-bottom">
        <!-- submit -->
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

        <!-- cancel -->
        <el-button type="info" plain @click="clearConfig()">Cancel</el-button>

        <!-- reset to defaults -->
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
class configModel {
  _stay_on_top: boolean = false
  _tray: boolean = false
  _theme: string = 'light'
  _ua_tray: string = ''
  _prompt_path: string = ''
  _main_width: number = 0
  _main_height: number = 0
}
const config = ref({} as configModel)
window.electronAPI.getConfig().then((con : any)=> {
  config.value = con
}, () => {
  config.value = {} as configModel
})
// update
class updateInfoModel {
  version: string = ''
  skip: boolean = false
  auto: boolean = false
}
const updateInfo = ref({} as updateInfoModel)
window.electronAPI.getUpdateInfo().then((info : any)=> {
  updateInfo.value = info
}, (err: Error) => {
  console.log(err)
})

// service
function openConfig(){
  window.electronAPI.openConfig()
}
function updateConfig() {

  // err msg
  const error = (err:any)=> {
    ElMessageBox.alert(
        'Configuration saved failed. Please try again. error: ' + err,
        'Notification',
        {
          confirmButtonText: 'OK',
          type: 'error',
        }
    )
  }

  // config
  const configClone = JSON.parse(JSON.stringify(config.value))
  window.electronAPI.updateConfig(configClone).then((result : any)=> {
    if (result=='ok'){

      // update info
      const updateInfoClone = JSON.parse(JSON.stringify(updateInfo.value))
      window.electronAPI.setUpdateInfo(updateInfoClone).then((infoResult : any)=> {
        if (infoResult=='ok'){
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

        }else{
          error(infoResult)
        }
      }, (err: Error) => {
        error(err)
      })

    }else{
      error(result)
    }
  }, (err: Error) => {
    error(err)
  })
}
function clearConfig(){
  // config
  window.electronAPI.getConfig().then((con : any)=> {
    config.value = con
  }, () => {
    config.value = {} as configModel
  })

  // update
  window.electronAPI.getUpdateInfo().then((info : any)=> {
    updateInfo.value = info
  }, (err: Error) => {
    console.log(err)
  })
}
function resetConfig(){

  const error = (err:any)=> {
    ElMessageBox.alert(
        'Configuration saved failed. Please try again. error: ' + err,
        'Notification',
        {
          confirmButtonText: 'OK',
          type: 'error',
        }
    )
  }
  // config
  window.electronAPI.resetConfig().then((result : any)=> {
    if (result=='ok'){

      // update info
      window.electronAPI.resetUpdateInfo().then((result : any)=> {
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
          }, (err: Error) => {
            error(err)
          })

        }else{
          error(result)
        }

      }, (err: Error) => {
        error(err)
      })

    }else{
      error(result)
    }

  }, (err: Error) => {
    error(err)
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
  font-size: 15px;
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

/* items */
.control-center-setting-items {
  margin: 16px 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 1fr;
  grid-column-gap: 0;
  grid-row-gap: 0;
}

.control-center-setting-items span {
  font-size: 15px;
  padding-right: 40px;
  justify-self: end;
  align-self: center;
  grid-area: 1 / 1 / 2 / 2;
}

.control-center-setting-items-value{
  grid-area: 1 / 2 / 2 / 4;
}

/* bottom */
.control-center-setting-bottom{
  margin: 16px 150px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 1fr;
  grid-column-gap: 0;
  grid-row-gap: 0;
}

</style>