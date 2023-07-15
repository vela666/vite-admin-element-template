<template>
  <div class="hamburger-section" @click="toggleSideBar">
    <SvgIcon
      name="hamburger"
      class="hamburger"
      :class="{ 'is-active': appStore.sidebar.opened }" />
  </div>
</template>

<script setup>
import useAppStore from '@/store/modules/app'

const appStore = useAppStore()

const toggleSideBar = () => {
  appStore.TOGGLE_SIDEBAR()
}
defineOptions({
  name: 'HamBurger',
})
</script>

<style scoped lang="scss">
.hamburger-section {
  margin: 0 15px;
  height: 100%;
  line-height: 50px;
  .hamburger {
    display: inline-block;
    vertical-align: middle;
    width: 20px;
    height: 20px;
  }

  .hamburger.is-active {
    transform: rotate(180deg);
  }
}
</style>
