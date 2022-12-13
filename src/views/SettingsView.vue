<template lang="pug">
v-row#settings
  v-col(cols="12")
    h1.text-center 設定
  v-col(cols="12")
    v-table
      thead
        tr
          th.text-center 名稱
          th.text-center 試聽
          th.text-center 選擇
      tbody
        tr(v-for="alarm in alarms" :key="alarm.id")
          td {{ alarm.name }}
          td.text-center
            audio(:src="alarm.file" controls)
          td.text-center
            v-radio-group(v-model="selectedAlarms")
              v-radio(:value="alarm.id")
</template>

<script setup>
import { useSettingsStore } from '@/stores/settings'
import { storeToRefs } from 'pinia'

const settings = useSettingsStore()
const { alarms, selectedAlarms } = storeToRefs(settings)
</script>
