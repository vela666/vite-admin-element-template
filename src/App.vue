<template>
  <!--  <ElConfigProvider :locale="locale" :size="appStore.size" namespace="el">-->
  <router-view />
  <!--  </ElConfigProvider>-->
</template>

<script setup>
/*
import { computed } from 'vue'
import zh from 'element-plus/dist/locale/zh-cn'
import en from 'element-plus/dist/locale/en'
import useAppStore from '@/store/modules/app'
*/

// import { useI18n } from 'vue-i18n'
// const { t } = useI18n()
// const appStore = useAppStore()
// const locale = computed(() => (appStore.lang === 'zh' ? zh : en))
defineOptions({ name: 'App' })
</script>
