<template>
  <div class="control-center-prompt-container">
    <div class="control-center-prompt-title">
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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {ElMessageBox} from "element-plus";

let prompt = ref('')

// prompt
window.electronAPI.getPrompt().then((con : any)=> {
  prompt.value = con
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
</script>

<style scoped>
/* contains */
.control-center-prompt-container{
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-user-select: none;
}

/* top */
.control-center-prompt-title{
  margin: 16px 50px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: 1fr;
  grid-column-gap: 0;
  grid-row-gap: 0;
}
</style>