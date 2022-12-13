import { defineStore } from 'pinia'

export const useSettingsStore = defineStore({
  // 設定這個 store 的 id
  id: 'settings',
  // 設定這個 store 的存放的資料 => data
  state () {
    return {
      alarms: [
        { id: 1, name: 'Alarm', file: new URL('@/assets/alarm.mp3', import.meta.url).href },
        { id: 2, name: 'Yay', file: new URL('@/assets/yay.mp3', import.meta.url).href }
      ],
      selectedAlarms: 2,
      // 開啟通知(預設關閉)
      notify: false
    }
  },
  actions: {
    // permission 為 promise
    async toggleNotify () {
      // 如果通知狀態為 true 且 window 有 'Notification' 通知功能
      if (!this.notify && 'Notification' in window) {
        // permission 請求權限結果
        const permission = await Notification.requestPermission()
        // granted 允許、denied 拒絕、default默認
        if (permission === 'granted') {
          // 轉為 true (開啟提醒)
          this.notify = true
        }
      } else {
        this.notify = false
      }
    }
  },
  getters: {
    // 選定鈴聲為設定中選擇的
    selectedAlarmFile () {
      const i = this.alarms.findIndex(alarm => alarm.id === this.selectedAlarms)
      return this.alarms[i].file
    }
  },
  // 存在本地端 localstorage
  persist: {
    // localstorage 名稱
    key: 'pomodoro-settings',
    // paths 只存特定的 data
    paths: ['selectedAlarms', 'notify']
  }
})
