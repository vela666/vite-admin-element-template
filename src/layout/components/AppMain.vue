<template>
  <section class="app-main">
    <div>
      <router-view #default="{ Component }">
        <!--        <Transition appear name="fade-transform" mode="out-in">
          <keep-alive :include="tagsViewStore.cachedViews" :max="6">
            <component :is="Component" :key="$route.path" />
          </keep-alive>
        </Transition>-->
        <keep-alive :include="tagsViewStore.cachedViews" :max="6">
          <component :is="Component" :key="$route.path" />
        </keep-alive>
      </router-view>
    </div>
  </section>
</template>

<script setup>
import useTagsViewStore from '@/store/modules/tagsView'
const tagsViewStore = useTagsViewStore()
defineOptions({
  name: 'AppMain',
})
</script>

<style lang="scss" scoped>
.app-main {
  width: 100%;
  position: relative;
  overflow: hidden;
  background: #f0f2f5;
  > div {
    padding: $size-20;
  }
}
</style>
