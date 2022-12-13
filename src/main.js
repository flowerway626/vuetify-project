/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'

// PWA
import { registerSW } from 'virtual:pwa-register'
// 使用條件
// 1. 網址須為 localhost or https
// 2. 要有 s ervice worker(推送通知、使用快取 + 離線瀏覽...)
// 3. 要有大小 icon

// 註冊 service worker 所需
registerSW({
  // 預設當網頁有版本更新時會推送訊息詢問使否更新
  // 改成自動更新不詢問
  onNeedRefresh () {},
  onOfflineReady () {}
})

const app = createApp(App)

registerPlugins(app)

app.mount('#app')
