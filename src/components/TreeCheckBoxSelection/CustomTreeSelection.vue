<template>
  <div
    :class="{
      'optional-data-tree-selection-hide-operate': hide,
    }"
    :style="`height:${height}`"
    class="optional-data-tree-selection">
    <SelectionLeft
      :optionalList="state.optionalList.length"
      :isIndeterminate="state.isIndeterminate"
      v-model:checked="state.checked"
      v-model:search="state.search"
      @change="checkedAll">
      <template #leftTop v-if="$slots.leftTop">
        <slot name="leftTop"></slot>
      </template>
      <CustomElTreeCheckBox
        default-expand-all
        v-bind="attrs"
        ref="treeRef"
        :props="treeProps"
        @checkBoxChange="checkBoxChange"
        :node-key="nodeKey"
        :filter-node-method="filterMethod"
        @updNode="updNode"
        :data="state.cloneOptionalData">
        <template #default="{ data }">
          <div class="flex w100-percentage overflow-hidden">
            <span
              class="mr10"
              :class="{ 'txt-bold': data.topLevel }"
              v-showTips>
              {{ data[treeProps.label] }}
            </span>
          </div>
        </template>
      </CustomElTreeCheckBox>
    </SelectionLeft>

    <SelectionRight
      :rightShowParent="rightShowParent"
      :selectLists="selectLists.length"
      :defaultSelectedAndDisabledNode="defaultSelectedAndDisabledNode.length"
      :mapSelectLists="mapSelectLists"
      @delData="delData"
      :treeProps="treeProps">
      <template #rightCustom v-if="$slots.rightCustom">
        <slot
          :mapSelectLists="mapSelectLists"
          :selectLists="selectLists"
          :delData="delData"
          name="rightCustom"></slot>
      </template>
      <template #rightTop v-if="$slots.rightTop">
        <slot name="rightTop"></slot>
      </template>
      <template #rightOperate="{ data }" v-if="$slots.rightOperate">
        <slot name="rightOperate" :data="data" :delData="delData"> </slot>
      </template>
    </SelectionRight>
  </div>
</template>

<script setup>
import { useAttrs } from 'vue'
// 适用于有禁用节点的存在，element-plus目前自带的有bug
// 目前有两种回显方式
// 1： 处理data的数据 src/views/see-plate/components/SideKanBan/components/AddOrEditSpace/index.vue
// 2： 传入已选列表
import useOperation from './useOperation'
import SelectionLeft from './SelectionLeft.vue'
import SelectionRight from './SelectionRight.vue'

const attrs = useAttrs()
const props = defineProps({
  props: {
    type: Object,
    default() {
      return {}
    },
  },
  nodeKey: {
    type: String,
    default: 'id',
  },
  height: {
    type: String,
    default: '700px',
  },
  data: {
    type: Array,
    default() {
      return []
    },
  },
  hide: {
    type: Boolean,
    default: false,
  },
  /*
   数据回显
   [
       {
         // 要和 nodeKey一致
         id: 124,
         name: 'chenys',
         // 不传 默认为true
         selected: true,
         // 和treeProps.value里的 disabled字段值一致
         disabled: true,
         // notShow 为true 过滤节点
         notShow: false,
       },
       ...
   ]*/
  selectedList: {
    type: Array,
    default() {
      return []
    },
  },
  // 右侧显示父级
  rightShowParent: {
    type: Boolean,
    default: true,
  },
})
// change事件里返回对应的树结构层级
const emit = defineEmits(['change'])
const selected = defineModel({
  type: Array,
  default() {
    return []
  },
})

const {
  state,
  treeRef,
  treeProps,
  selectLists,
  mapSelectLists,
  defaultSelectedAndDisabledNode,
  delData,
  updNode,
  checkedAll,
  filterMethod,
  checkBoxChange,
} = useOperation({
  props,
  emit,
  selected,
})
console.log(11)
defineExpose({
  treeRef,
})
defineOptions({
  name: 'CustomTreeSelection',
})
</script>

<style lang="scss">
.optional-data-tree-selection {
  display: flex;
  border-radius: 4px;
  border: 1px solid #dedede;
  width: 100%;
  //flex: 1;
  overflow: hidden;

  > div {
    display: flex;
    flex-direction: column;
    padding-top: 5px;
    //padding: 5px 10px 10px 10px;
    flex: 1;
    overflow: hidden;
  }
  .selection-left {
    width: 280px;
  }
  .selection-left,
  .selection-right {
    > div {
      &:not(:last-of-type) {
        padding: 0 10px;
      }
      &:last-of-type {
        padding: 0 10px;
        margin-bottom: 10px;
      }
    }
  }
  .selection-exhibit {
    margin-top: 5px;
    height: 100%;
    overflow-y: auto;

    .selection-list {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 0 10px;
      height: 32px;
      line-height: 32px;
      border-radius: 2px;
      &:hover {
        color: #5473e8;
      }
    }
    .selected {
      height: 32px;
      padding: 0 10px;
      background-color: #f5f7fa;
      &:not(:last-of-type) {
        margin-bottom: 10px;
      }
      &:hover {
        * {
          color: #5473e8 !important;
        }
      }
    }
  }

  .selection-left {
    border-right: 1px solid #dedede;

    .selection-left-all {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}

.optional-data-tree-selection-hide-operate {
  .selection-left {
    display: none;
    pointer-events: none;
  }
  .selection-right {
    > div {
      &:first-of-type {
        display: none;
      }
    }
  }
}
</style>
