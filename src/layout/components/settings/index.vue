<template>
  <el-drawer
    :size="315"
    v-model="settingStore.showSettings"
    direction="rtl"
    append-to-body>
    <template #header>
      <h4 class="drawer-title">项目配置</h4>
    </template>
    <template #default>
      <div>
        <el-divider content-position="center">系统配置</el-divider>

        <div class="drawer-item">
          <span>开启 TagsView</span>
          <el-switch
            v-model="tagsView"
            inline-prompt
            active-text="开"
            inactive-text="关" />
        </div>
        <div class="drawer-item">
          <span>固定 Header</span>
          <el-switch
            v-model="fixedHeader"
            inline-prompt
            active-text="开"
            inactive-text="关" />
        </div>
        <div class="drawer-item">
          <span>侧边栏 Logo</span>
          <el-switch
            v-model="sidebarLogo"
            inline-prompt
            active-text="开"
            inactive-text="关" />
        </div>

        <el-divider content-position="center">布局模式</el-divider>

        <div class="drawer-item">
          <div class="layoutMode">
            <el-tooltip
              class="box-item"
              effect="dark"
              content="左侧模式"
              placement="top-start">
              <div class="modeItem" @click="layoutMod = 'vertical'">
                <div></div>
                <div></div>
              </div>
            </el-tooltip>

            <el-tooltip
              class="box-item"
              effect="dark"
              content="顶部模式( todo : coming soon )"
              placement="top-start">
              <div
                class="modeItem"
                :class="{ active: layoutMod == 'horizontal' }"
                @click="layoutMod = 'horizontal'">
                <div></div>
                <div></div>
              </div>
            </el-tooltip>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-alert type="success">
          <template #title>
            <el-link
              type="primary"
              href="https://github.com/mvpyb/vite-element-admin"
              >点我前往github
            </el-link>
          </template>
        </el-alert>
      </div>
    </template>
  </el-drawer>
</template>

<script setup>
import { computed } from 'vue'
import useSettingsStore from '@/store/modules/settings'

const settingStore = useSettingsStore()

const fixedHeader = computed({
  get() {
    return settingStore.fixedHeader
  },
  set(val) {
    settingStore.CHANGE_SETTING({
      key: 'fixedHeader',
      value: val,
    })
  },
})
const tagsView = computed({
  get() {
    return settingStore.tagsView
  },
  set(val) {
    settingStore.CHANGE_SETTING({
      key: 'tagsView',
      value: val,
    })
  },
})

const sidebarLogo = computed({
  get() {
    return settingStore.sidebarLogo
  },
  set(val) {
    settingStore.CHANGE_SETTING({
      key: 'sidebarLogo',
      value: val,
    })
  },
})

const layoutMod = computed({
  get() {
    return settingStore.layoutMod
  },
  set(val) {
    settingStore.CHANGE_LAYOUT_MOD(val)
  },
})
defineOptions({
  name: 'Settings',
})
</script>

<style lang="scss" scoped>
.drawer-title {
  font-size: 18px;
}

.drawer-item {
  height: 32px;
  margin: 25px 0;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/*导航模式*/
.layoutMode {
  width: 100%;
  height: 50px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  .modeItem {
    width: 18%;
    height: 45px;
    background: #f0f2f5;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    border-radius: 4px;
    box-shadow: 0 1px 2.5px 0 rgb(0 0 0 / 18%);

    &:nth-child(1) {
      div {
        &:nth-child(1) {
          width: 30%;
          height: 100%;
          background: #1b2a47;
        }

        &:nth-child(2) {
          width: 70%;
          height: 30%;
          top: 0;
          right: 0;
          background: #fff;
          box-shadow: 0 0 1px #888;
          position: absolute;
        }
      }
    }

    &:nth-child(2) {
      div {
        &:nth-child(1) {
          width: 100%;
          height: 30%;
          background: #1b2a47;
          box-shadow: 0 0 1px #888;
        }
      }
    }

    &:nth-child(3) {
      div {
        &:nth-child(1) {
          width: 100%;
          height: 30%;
          background: #1b2a47;
          box-shadow: 0 0 1px #888;
        }

        &:nth-child(2) {
          width: 30%;
          height: 70%;
          bottom: 0;
          left: 0;
          background: #fff;
          box-shadow: 0 0 1px #888;
          position: absolute;
        }
      }
    }

    &.active {
      border: 2px solid #409eff;
    }
  }
}
</style>
