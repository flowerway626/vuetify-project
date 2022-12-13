import { defineStore } from 'pinia'

const time = parseInt(import.meta.env.VITE_TIME)
const timeBreak = parseInt(import.meta.env.VITE_TIME_BREAK)

export const useListStore = defineStore({
  id: 'list',
  state () {
    return {
      // 事項陣列
      items: [],
      // 已完成
      finishedItems: [],
      // 目前進行中(要計時)
      currentItem: '',
      // 唯一值
      id: 1,
      // 暫停休息
      break: false,
      // 預設時間
      timeleft: time
    }
  },
  // 修改 state 的 function
  actions: {
    addItem (name) {
      // 用 this 指向 state
      this.items.push({
        id: this.id++,
        name,
        edit: false,
        model: name
      })
    },
    // 取得選擇該項目的 id 值
    getItemIndexById (id) {
      return this.items.findIndex(items => items.id === id)
    },
    // 開啟編輯
    editItem (id) {
      const i = this.getItemIndexById(id)
      this.items[i].edit = true
    },
    // 刪除項目
    delItem (id) {
      const i = this.getItemIndexById(id)
      this.items.splice(i, 1)
    },
    // 確認編輯
    comfirmEditItem (id) {
      const i = this.getItemIndexById(id)
      // name 換 成 新輸入的內容
      this.items[i].name = this.items[i].model
      // 關閉編輯
      this.items[i].edit = false
    },
    // 取消編輯
    undoEditItem (id) {
      const i = this.getItemIndexById(id)
      // name 換 回 新輸入的內容
      this.items[i].model = this.items[i].name
      this.items[i].edit = false
    },
    // 開始
    start () {
      // 如果 break 為 false 把代辦事項第一個移到目前進行中 currentItem 陣列並移除
      this.currentItem = this.break ? '休息一下' : this.items.shift().name
    },
    // 倒數計時秒數
    countdown () {
      this.timeleft--
    },
    // 完成
    finish () {
      // break 為 true (非暫停休息時)
      if (!this.break) {
        // 把完成的事項移至 finishedItems 陣列
        this.finishedItems.push({
          name: this.currentItem,
          // id 辨別用不重複
          id: this.id++
        })
      }
      // 清除目前進行中事項
      this.currentItem = ''
      // 還有代辦事項時
      if (this.items.length > 0) {
        // break 切回 true
        this.break = !this.break
      }
      this.timeleft = this.break ? timeBreak : time
    },
    // 刪除完成事項
    delFinishedItem (id) {
      const i = this.finishedItems.findIndex(item => item.id === id)
      this.finishedItems.splice(i, 1)
    }
  },
  // 存在本地端 localstorage
  persist: {
    key: 'pomodoro-list'
  }
})
