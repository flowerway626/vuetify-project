<!-- 如全清空會有錯誤需至少放入 template -->
<!-- 預設首頁 -->
<template lang="pug">
v-row#home
  v-col(cols="12")
    h1 {{ currentText }}
    h1 {{ currentTime }}
  v-col(cols="12")
    v-btn.mr-5(v-if="status !== 1" icon="mdi-play" varient="text" @click="startTimer")
    v-btn(v-else icon="mdi-pause" varient="text" @click="pauseTimer")
    //- 有目前進行 ing 事項 才顯示快轉 icon
    v-btn.mr-5(v-if="currentItem.length > 0" icon="mdi-skip-next" varient="text" @click="finishTimer")
</template>

<script setup>
import { computed, ref, onUnmounted } from 'vue'
import { useListStore } from '@/stores/list'
import { useSettingsStore } from '@/stores/settings'
// storeToRefs 為 pinia 解構寫法
import { storeToRefs } from 'pinia'

// 從 list.js 解構
const list = useListStore()
const { currentItem, items, timeleft } = storeToRefs(list)
// 從 settings.js 解構
const settings = useSettingsStore()
const { selectedAlarmFile, notify } = storeToRefs(settings)

// funciton 不會變，免用響應式免解構省資源
const { start, countdown, finish } = list
// 0 = 停止
// 1 = 倒數中
// 2 = 暫停
const status = ref(0)

// icon 方法二
// const stuatsCode = {
//   STOP: 0,
//   COUNTDOWN: 1,
//   PAUSE: 2
// }
// const status = ref(stuatsCode.STOP)

// 換頁時觸發
// vue 內建元件功能
onUnmounted(() => {
  console.log('Home unmounted')
})

// 上面 template 用不到免用 ref
let timer = 0
const startTimer = () => {
  // 代辦事項有東西時，把第一項拿出來
  if (status.value === 0 && items.value.length > 0) {
    start()
  }
  // 如果目前 ing 有東西
  if (currentItem.value.length > 0) {
    // 改為倒數中
    status.value = 1
    timer = setInterval(() => {
      // 剩餘秒數 timeleft
      // 動到數值所以寫在 actoins 的 funciton
      countdown()
      if (timeleft.value === 0) {
        finishTimer()
      }
    }, 1000)
  }
}
// 暫停
const pauseTimer = () => {
  // 換回暫停 icon
  status.value = 2
  clearInterval(timer)
}
// 完成
const finishTimer = () => {
  clearInterval(timer)
  // 換回停止 icon
  status.value = 0
  const audio = new Audio()
  audio.src = selectedAlarmFile.value
  // 播音樂
  audio.play()
  if (notify.value) {
    // eslint-disable-next-line
    const notifycation = new Notification('事項完成', {
      body: currentText.value,
      icon: 'https://github.com/flowerway626.png'
    })
  }
  finish()
  // 如果還有事項時繼續跑
  if (items.value.length > 0) {
    startTimer()
  }
}

// 事項文字
const currentText = computed(() => {
  // 如果 items 有東西時顯示 點擊開始
  return currentItem.value.length > 0 ? currentItem.value : items.value.length > 0 ? '點擊開始' : '沒有事項'
})

// 事項倒數計時
const currentTime = computed(() => {
  // 分鐘
  const m = Math.floor(timeleft.value / 60).toString().padStart(2, '0')
  // 秒數
  const s = (timeleft.value % 60).toString().padStart(2, '0')
  return m + '：' + s
})
</script>
