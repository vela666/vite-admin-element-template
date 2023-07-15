<template>
  <div class="navbar" :class="settingsStore.layoutMod + '-nav-section'">
    <div
      v-if="settingsStore.layoutMod === 'horizontal'"
      class="horizontal-sidebar-container">
      <Logo />
      <NavMenu />
    </div>

    <div class="flex-center" v-if="settingsStore.layoutMod === 'vertical'">
      <HamBurger id="hamburger-container" class="hamburger-container" />
      <BreadCrumb id="breadcrumb-container" class="breadcrumb-container" />
    </div>

    <div class="right-menu" :class="{ mobile: appStore.device === 'mobile' }">
      <HeaderSearch
        id="header-search"
        class="p8"
        v-show="appStore.device !== 'mobile'" />

      <ScreenFull id="screenfull" class="p8 hover-effect" />

      <el-tooltip content="全局size设置" effect="dark" placement="bottom">
        <size-select id="size-select" class="p8 hover-effect" />
      </el-tooltip>

      <LangSelect class="p8 hover-effect" />

      <el-dropdown
        class="p8 avatar-container right-menu-item hover-effect"
        trigger="click">
        <div class="avatar-wrapper">
          <img
            :src="userStore.avatar + '?imageView2/1/w/80/h/80'"
            class="user-avatar" />

          <div class="username">
            {{ userStore.name }}
            <el-icon class="arrow">
              <ArrowDown />
            </el-icon>
          </div>
        </div>

        <template #dropdown>
          <el-dropdown-menu>
            <router-link to="/">
              <el-dropdown-item>首页</el-dropdown-item>
            </router-link>
            <a target="_blank" href="https://github.com/vela666">
              <el-dropdown-item>Github</el-dropdown-item>
            </a>
            <el-dropdown-item divided @click="logout">
              <span>退出</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <div class="p8 el-icon-setting hover-effect" @click="openSettings">
        <el-icon class="setting">
          <Setting />
        </el-icon>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import useAppStore from '@/store/modules/app'
import useSettingsStore from '@/store/modules/settings'
import useUserStore from '@/store/modules/users'

import HamBurger from './components/HamBurger'
import BreadCrumb from './components/BreadCrumb'
import HeaderSearch from './components/HeaderSearch'
import ScreenFull from './components/Screenfull'
import SizeSelect from './components/SizeSelect'
import LangSelect from './components/LangSelect'

import Logo from '@/layout/components/sidebar/Logo'
import NavMenu from '../sidebar/NavMenu'

const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()
const settingsStore = useSettingsStore()

// 退出登录
const logout = async () => {
  await userStore.loginOut()
}

const openSettings = () => {
  settingsStore.showSettings = true
}

defineOptions({
  name: 'NavBar',
})
</script>

<style lang="scss" scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  height: $size-56;
  align-items: center;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  padding: 0 10px;
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    cursor: pointer;
    transition: background $layout-transition-time;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    height: 100%;
    display: flex;
    align-items: center;
    color: #000000d9;
    .icons {
      height: 100%;
      line-height: 50px;
      display: inline-block;
    }

    &:focus {
      outline: none;
    }

    .hover-effect {
      cursor: pointer;
      transition: background 0.3s;

      &:hover {
        background: rgba(0, 0, 0, 0.025);
      }
    }

    .p8 {
      padding: 0 8px;
    }

    .right-menu-item {
      height: 100%;
      color: #5a5e66;
    }

    .avatar-container {
      display: flex;
      align-items: center;
      margin-right: 30px;

      .avatar-wrapper {
        display: flex;
        align-items: center;
        position: relative;
        white-space: nowrap;

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .username {
          margin-left: 12px;
          font-size: 14px;
          position: relative;
        }

        .arrow {
          position: absolute;
          right: -20px;
          top: 0;
          font-size: 12px;
        }
      }
    }

    .el-icon-setting {
      font-size: 16px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-around;

      .setting {
        color: #000;
      }
    }
  }

  &.horizontal-nav-section {
    .horizontal-sidebar-container {
      display: flex;
      //flex: 1;
      height: 100%;
      background: rgba(0, 0, 0, 0.2);
      position: relative !important;
      align-items: center;
      width: 100%;
      //min-width: 550px;
      overflow: hidden;
    }

    .right-menu {
      :deep(.header-search) {
        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }

      :deep(.svg-icon) {
        color: #fff;
      }

      .icons {
        color: #fff;
      }

      .hover-effect {
        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }

      .right-menu-item {
        color: #fff;
      }

      .el-icon-setting {
        .setting {
          color: #fff;
        }
      }
    }
  }
}
</style>
