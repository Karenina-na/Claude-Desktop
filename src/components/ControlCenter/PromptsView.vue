<template>
Prompts

  <button>test</button>
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
</script>

<style scoped>

</style>