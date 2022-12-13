<template lang="pug">
v-row#list
  v-col(cols="12")
    h1.text-center 代辦事項
  v-col(cols="12")
    //- 輸入欄
    v-text-field(ref="input" v-model="newItem" variant="underlined" label="add item" :rules="[rules.required, rules.length]" @keydown.enter="onInputSubmit")
      template(#append)
        //- 新增 +
        v-btn(icon="mdi-plus" variant="text" @click="onInputSubmit")
    v-table
      thead
        tr
          th 名稱
          th 操作
      tbody
        tr(v-for="item in items" :key="item.id" ref="editInputs")
          td
            //- autofocus 選到該欄時自動可以打字
            v-text-field(v-if="item.edit" v-model="item.model" autofocus :rules="[rules.required, rules.length]")
            span(v-else) {{ item.name }}
          td.text-left
            //- 編輯模式
            span(v-if="item.edit")
              //- 打勾(編輯完成)
              v-btn(icon="mdi-check" variant="text" color="blue" @click="comfirmEditItem(item.id)")
              //- 叉叉(取消編輯)
              v-btn(icon="mdi-undo" variant="text" color="red" @click="undoEditItem(item.id)")
            //- 一般模式
            span(v-else)
              //- 鉛筆(編輯)
              v-btn(icon="mdi-pencil" variant="text" color="blue" @click="editItem(item.id)")
              //- 刪除
              v-btn(icon="mdi-delete" variant="text" color="red" @click="delItem(item.id)")
  v-divider
  v-col(cols="12")
    h1.text-center 已完成
  v-col(cols="12")
    v-table
      thead
        tr
          th 名稱
          th 操作
      tbody
        tr(v-if="finishedItems.length === 0")
          td.text-center(colspan="2") 沒有事項
        tr(v-for="item in finishedItems" v-else :key="item.id" ref="editInputs")
          td {{ item.name }}
          td
            v-btn(icon="mdi-delete" variant="text" color="red" @click="delFinishedItem(item.id)")
</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useListStore } from '@/stores/list'

const list = useListStore()
const { addItem, editItem, comfirmEditItem, delItem, undoEditItem, delFinishedItem } = list
const { items, finishedItems } = storeToRefs(list)

const newItem = ref('')
const input = ref(null)
const editInputs = ref([])

// 必填驗證 function
// rules[] 驗證規則
const rules = {
  // v(value簡寫) 輸入欄位收到的值
  required (v) {
    // ! 轉布林值把值轉為 false，加 ! 會轉相反so!! (負負得正 => 兩個!!)
    return !!v || '欄位必填'
  },
  length (v) {
    return v.length >= 3 || '需輸入至少 3 個字元'
  }
}

// 完成輸入按下 enter 或 按下新增
const onInputSubmit = async () => {
  // validate 驗證 設定為 promise 因此需使用 async/await
  // 會回傳陣列，[]裡存放驗證內容
  const valid = await input.value.validate()
  console.log(valid)
  // 判斷如有錯誤訊息時，EX: '需輸入至少 3 個字元' (錯誤訊息字數 > 0 => return)
  if (valid.length > 0) return

  // 建議寫在 state / actions
  addItem(newItem.value)
  // addItem(newItem.value)
  // $el 取得元件的 html

  // .blur() 取消 focus (新增完事項後 input 不會再出現'欄位必填'錯誤)
  input.value.$el.querySelector('input').blur()

  // 重置清空 input.value
  input.value.reset()

  // ------ 其他寫法 -------
  // items.value.push({
  //   id: id.value++,
  //   name: newItem.value,
  //   edit: false,
  //   model: newItem.value
  // })

  // items.value.push({
  //   id,
  //   name: newItem.value,
  //   edit: false,
  //   model: newItem.value
  // })
  // id.value++

  // list.$patch(state => {
  //   state.items.push({
  //     id,
  //     name: newItem.value,
  //     edit: false,
  //     model: newItem.value
  //   })
  //   state.id++
  // })
}
</script>
