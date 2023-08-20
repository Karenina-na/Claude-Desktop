<template>
  <div class="control-center-prompt-container">
    <div class="control-center-prompt-title">
      <div class="control-center-prompt-title-left">
        <div>URL: &nbsp;&nbsp;<span @click="copyURL()">{{ promptURL }}</span></div>
        <div>Cache: &nbsp;&nbsp;<span @click="openPrompt()">{{ promptDir }}</span></div>
      </div>
      <div class="control-center-prompt-title-right">
        <el-button-group>
          <el-button type="success" plain @click="enable()">
            <i-ep-check/>&nbsp;Enable
          </el-button>
          <el-button type="danger" plain @click="disable()">
            <i-ep-close/>&nbsp;Disable
          </el-button>
        </el-button-group>
      </div>
    </div>

    <div class="control-center-prompt-button">
      <!-- sync -->
      <el-popconfirm
          width="260"
          confirm-button-text="OK"
          cancel-button-text="No, Thanks"
          icon-color="#409eff"
          title="Sync will overwrite the previous data, confirm to sync?"
          @confirm="syncPrompt"
      >
        <template #reference>
          <el-button type="primary" plain>Sync</el-button>
        </template>
      </el-popconfirm>

      <!-- submit -->
      <el-popconfirm
          width="240"
          confirm-button-text="OK"
          cancel-button-text="No, Thanks"
          icon-color="#67c23a"
          title="Are you sure to submit this?"
          @confirm="updatePrompt"
      >
        <template #reference>
          <el-button type="success" plain>Submit</el-button>
        </template>
      </el-popconfirm>

      <!-- cancel -->
      <el-button type="info" plain @click="clearPrompt()">Cancel</el-button>

      <!-- reset -->
      <el-popconfirm
          width="280"
          confirm-button-text="OK"
          cancel-button-text="No, Thanks"
          icon-color="#e6a23c"
          title="Are you sure to reset to defaults?"
          @confirm="resetPrompt"
      >
        <template #reference>
          <el-button type="warning" plain>Reset to defaults</el-button>
        </template>
      </el-popconfirm>
    </div>

    <!-- prompt content -->
    <div class="control-center-prompt-content">
      <el-table
          ref="multipleTableRef"
          :data="paginate(prompt, pageSize, currentPage)"
          @selection-change="handleSelectionChange"
          :headerCellStyle ="tableHeaderBackground()"
          :row-style="tableContentBackground()"
      >
        <!-- selection -->
        <el-table-column type="selection" width="30px"/>
        <!-- Type -->
        <el-table-column label="Type" :width="typeWidth" show-overflow-tooltip >
          <template #default="scope">{{ scope.row.CMD }}</template>
        </el-table-column>
        <!-- Act -->
        <el-table-column  label="Act" :width="actWidth" show-overflow-tooltip>
          <template #default="scope">{{ scope.row.ACT }}</template>
        </el-table-column>
        <!-- Enable -->
        <el-table-column label="Enable" width="75" >
          <template #default="scope">
            <el-switch
                v-model="scope.row.ENABLE"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-icon-class="el-icon-check"
                inactive-icon-class="el-icon-close"
            />
          </template>
        </el-table-column>
        <!-- Prompt -->
        <el-table-column label="Prompt">
          <template #default="scope" >
            <el-tooltip
                content="Click to copy the prompt"
                placement="top-end"
                effect="dark"
            >
            <span @click="copyPrompt(scope.row.PROMPT)"
                  style="display: inline-block; width: 100%;
                  text-overflow: ellipsis; white-space: nowrap;
                  overflow: hidden; user-select: none; cursor: pointer;"
            >{{ scope.row.PROMPT }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <!-- expand -->
        <el-table-column type="expand" label="<>">
          <template #default="scope">
            <div class="control-center-prompt-expand">
              {{ scope.row.PROMPT }}
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="control-center-prompt-pagination-block">
      <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[5, 10, 15, 20, 25]"
          :background="true"
          layout="total, prev, pager, next, sizes, jumper"
          :total="prompt.length"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import {ref} from 'vue';
import {ElMessageBox, ElNotification} from "element-plus";

// url
const promptURL = ref('')
window.electronAPI.getPromptURL().then((url : any)=> {
  promptURL.value = url
}, (err) => {
  console.log(err)
})
function copyURL(){
  navigator.clipboard.writeText(promptURL.value).then(() => {
        // success msg
        ElMessageBox.alert(
            'URL copied successfully.',
            'Notification',
            {
              confirmButtonText: 'OK',
              type: 'success',
            }
        )
      })
      .catch(err => {
        // err msg
        ElMessageBox.alert(
            'URL copied failed. Please try again. error: ' + err,
            'Notification',
            {
              confirmButtonText: 'OK',
              type: 'error',
            }
        )
      })
}

// dir
const promptDir = ref('')
class configModel {
  _stay_on_top: boolean = false
  _tray: boolean = false
  _theme: string = 'light'
  _ua_tray: string = ''
  _prompt_path: string = ''
  _main_width: number = 0
  _main_height: number = 0
}
window.electronAPI.getConfig().then((con : any)=> {
  promptDir.value = con._prompt_path
}, () => {
  promptDir.value = ""
})
function openPrompt(){
  window.electronAPI.openPrompt()
}

// prompt
let prompt = ref(Array())
window.electronAPI.getPrompt().then((con : any)=> {
  // 将con从json转为 array[{CMD, ACT,RPOMPT,ENABLE}]
  let temp = Array()
  for (let i in con) {
    temp.push(con[i])
  }
  prompt.value = temp
}, (err) => {
  console.log(err)
})
// sync prompt
function syncPrompt() {
  // err msg
  const error = (err:any)=> {
    ElMessageBox.alert(
        'Prompt sync failed. Please try again. error: ' + err,
        'Notification',
        {
          confirmButtonText: 'OK',
          type: 'error',
        }
    )
  }

  // prompt
  window.electronAPI.syncPrompt().then((prom : any)=> {
    if (prom=='ok') {
      // success msg
      ElMessageBox.alert(
          'Prompt sync successfully. Please wait for some time and refresh the page.',
          'Notification',
          {
            confirmButtonText: 'OK',
            type: 'success',
          }
      )
    } else {
      error(prom)
    }

  }, (err: Error) => {
    error(err)
  })
}
// update prompt
function updatePrompt() {
  // err msg
  const error = (err:any)=> {
    ElMessageBox.alert(
        'Prompt saved failed. Please try again. error: ' + err,
        'Notification',
        {
          confirmButtonText: 'OK',
          type: 'error',
        }
    )
  }

  // prompt
  const promptClone = JSON.parse(JSON.stringify(prompt.value))
  window.electronAPI.setPrompt(promptClone).then((result : any)=> {
    if (result=='ok') {
      // success msg
      ElMessageBox.alert(
          'Prompt saved successfully.',
          'Notification',
          {
            confirmButtonText: 'OK',
            type: 'success',
          }
      )
      // update prompt
      window.electronAPI.getPrompt().then((con : any)=> {
        prompt.value = con
      }, (err) => {
        console.log(err)
      })

    } else {
      error(result)
    }

  }, (err: Error) => {
    error(err)
  })
}
// clear
function clearPrompt(){
  window.electronAPI.getPrompt().then((con : any)=> {
    prompt.value = con
  }, (err) => {
    console.log(err)
  })
}
// reset prompt
function resetPrompt() {
  // err msg
  const error = (err:any)=> {
    ElMessageBox.alert(
        'Prompt reset failed. Please try again. error: ' + err,
        'Notification',
        {
          confirmButtonText: 'OK',
          type: 'error',
        }
    )
  }

  // prompt
  window.electronAPI.resetPrompt().then((prom : any)=> {
    if (prom!==null) {
      // success msg
      ElMessageBox.alert(
          'Prompt reset successfully.',
          'Notification',
          {
            confirmButtonText: 'OK',
            type: 'success',
          }
      )
      // update prompt
      prompt.value = prom

    } else {
      error(prom)
    }

  }, (err: Error) => {
    error(err)
  })
}

// page
const currentPage = ref(1)
const pageSize = ref(10)
const typeWidth = ref('220px')
const actWidth = ref('220px')
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
}
function paginate<T>(arr: T[], pageSize: number, currentPage: number): T[] {
  const start = pageSize * (currentPage-1);
  return arr.slice(start, start + pageSize);
}

// prompt control
const selection = ref(Array())
function handleSelectionChange(val: Array<any>) {
  selection.value = []
  val.forEach((item: any) => {
    let index = prompt.value.findIndex((value: any) => {
      return value.CMD === item.CMD
    })
    selection.value.push(index)
  })
}
function copyPrompt(prompt:string){
  navigator.clipboard.writeText(prompt).then(() => {
    // success msg
    ElMessageBox.alert(
        'prompt copied successfully.',
        'Notification',
        {
          confirmButtonText: 'OK',
          type: 'success',
        }
    )
  })
      .catch(err => {
        // err msg
        ElMessageBox.alert(
            'prompt copied failed. Please try again. error: ' + err,
            'Notification',
            {
              confirmButtonText: 'OK',
              type: 'error',
            }
        )
      })
}
function enable(){
  selection.value.forEach((item: any) => {
    prompt.value[item].ENABLE = true
  })
  ElNotification.success({
    title: 'Enabled successfully.',
    message: "Please submit to take effect.",
    position: 'bottom-right',
  })
}
function disable(){
  selection.value.forEach((item: any) => {
    prompt.value[item].ENABLE = false
  })
  ElNotification.success({
    title: 'Disabled successfully.',
    message: "Please submit to take effect.",
    position: 'bottom-right',
  })
}
const tableContentBackground = () => {
  return {
    'backgroundColor': 'rgb(234,233,230, 0.6)',
    'color': '#595959',
    'fontSize': '15px',
  }
}
const tableHeaderBackground = ()=>{
  return {
    'backgroundColor': 'rgba(234,233,230)',
    'color': '#595959',
    'fontSize': '16px',
  }
}
</script>

<style scoped>
/* contains */
.control-center-prompt-container{
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-user-select: none;
  user-select: none;
  text-align: center;
  justify-content: center;
  align-items: center;
  width: 100%;
}

/* top */
.control-center-prompt-title{
  display : flex;
  flex-direction: row;
  width: 100%;
}

.control-center-prompt-title-left{
  font-size: 16px;
  font-weight: 500;
  margin: 5px 10px;
}

.control-center-prompt-title-left div{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display : flex;
  flex-direction: row;
}
.control-center-prompt-title-left div span{
  cursor: pointer;
  color: #b78607;
  transition: all 0.2s;
}
.control-center-prompt-title-left div span:hover{
  color: #00c7b1;
  transition: all 0.2s;
}

.control-center-prompt-title-right{
  display : flex;
  align-items: center;
}

.control-center-prompt-button{
  margin: 5px 50px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: 1fr;
  grid-column-gap: 0;
  grid-row-gap: 0;
}

/** prompt */
.control-center-prompt-content{
  width: 98%;
  margin: 10px auto;
}

.control-center-prompt-expand{
  width: 90%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
}

/** bottom */
.control-center-prompt-pagination-block{
  width: 100%;
  display: flex;
  justify-content: center;
}

</style>