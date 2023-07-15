<template>
  <div :id="boxCls">
    <div
      v-for="item of gridData"
      class="grid-stack-item"
      :gs-x="item.x"
      :gs-y="item.y"
      :gs-id="item.id"
      :gs-h="item.h"
      :gs-w="item.w"
      :gs-min-w="item.w"
      :gs-min-h="item.h"
      :gs-no-resize="item.resize || noResize"
      :gs-no-move="item.move"
      :gs-locked="item.locked"
      :id="item.mark"
      :key="item.id">
      <div class="grid-stack-item-content">
        <div class="handler">
          拖我 {{ item.id }} x:{{ item.x }} -- y:{{ item.y }}
        </div>
        <button @click="remove(item.mark)">remove</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  computed,
  watch,
  nextTick,
  reactive,
  ref,
  shallowRef,
  onMounted,
} from 'vue'
import 'gridstack/dist/gridstack.min.css'
import { GridStack } from 'gridstack'
import { debounce } from 'lodash-es'

const props = defineProps({
  // id 唯一且为字符串类型 mark 用于 document.querySelector 或All 获取用的标识 且唯一
  // [{id: '1', w: 6, h: 4, x: 0, y: 0, mark: 'grid-item-1'}]
  modelValue: {
    type: Array,
    default: () => [],
  },
  noResize: {
    type: Boolean,
    default: false,
  },
  cellHeight: {
    type: [Number, String],
    default: 110,
  },
  // 用于实例化时区分多个容器，以免冲突
  boxCls: {
    type: String,
    default: 'dashboard-container',
  },
  margin: {
    type: [Number, String],
    default: 10,
  },
  dragHandle: {
    type: String,
    default: '',
  },
  needExternalDragIn: {
    type: Boolean,
    default: false,
  },
  // 外部拖拽的容器类名
  externalDragIn: {
    type: String,
    default: '.dashboard-drag-in',
  },
})

const emit = defineEmits(['update:modelValue'])

// 不要使用 ref(null) 作为代理 在比较结构时会破坏所有逻辑.
// see https://github.com/gridstack/gridstack.js/issues/2115
let myGridStack = null
const gridData = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

// 重新布局
const compactLayout = () => {
  nextTick(() => {
    // 重新布局
    myGridStack.compact()
  })
}

const remove = (target) => {
  /* gridData.value = gridData.value.filter((item) => {
    return item.mark !== target
  })*/
  myGridStack.removeWidget(`#${target}`)
  props.needExternalDragIn && setExternalDrag()
  // myGridStack.removeWidget(`#${target}`, false)
  compactLayout()
  nextTick(() => {
    gridData.value = getSaveLayout()
  })
}

const makeLayout = (id) => {
  nextTick(() => {
    myGridStack.makeWidget(`#${id}`)
  })
}

const getSaveLayout = (saveContent = false, saveGridOpt = false) => {
  return myGridStack.getGridItems().map((item) => {
    const id = item.getAttribute('gs-id')
    const node = {
      id: id,
      w: +item.getAttribute('gs-w'),
      h: +item.getAttribute('gs-h'),
      x: +item.getAttribute('gs-x'),
      y: +item.getAttribute('gs-y'),
      mark: item.getAttribute('id') || `grid-item-${id}`,
    }
    return node
  })
  /* let arr = []
  myGridStack.save(saveContent, saveGridOpt, (node) => {
    arr.push({
      w: node.w,
      h: node.h,
      id: node.id,
      mark: node.el.id,
      x: node.x,
      y: node.y,
    })
  })
  return arr*/
  /*return myGridStack.save(saveContent, saveGridOpt).map((item) => {
    return {
      w: item.minW,
      h: item.minH,
      id: item.id,
      mark: `grid-item-${item.id}`,
      x: item.x,
      y: item.y,
    }
  })*/
}
// 返回实例化
const getMyGridStack = () => {
  return myGridStack
}
// 设置外部拖入
const setExternalDrag = () => {
  nextTick(() => {
    GridStack.setupDragIn(`${props.externalDragIn} .grid-stack-item`, {
      appendTo: 'body',
    })
  })
}

// 加载布局
const reloadLayout = (data) => {
  nextTick(() => {
    myGridStack.load(gridData.value)
  })
}

const initLayout = (bool = false) => {
  // https://github.com/gridstack/gridstack.js/tree/master/doc#resizableel-val
  // 不要使用 grid.value = GridStack.init()
  myGridStack?.destroy(false)
  myGridStack = GridStack.init(
    {
      // animate: false,
      // auto: false,
      cellHeight: props.cellHeight + 'px',
      // rtl: true,
      // 只有该类名的元素才能拖动
      handle: props.dragHandle,
      margin: props.margin,
      resizable: {
        // 只允许从某个方向调整大小
        // s 下,n 上,ne 右上,e 右边,se 右下,sw 左下,w 左边,nw 左上
        handles: 's',
      },
      column: 12,
      styleInHead: true,
      disableOneColumnMode: true,
      // function example, but can also be: true | false | '.someClass' value
      acceptWidgets: (el) => {
        return true
      },
    },
    // 指定容器区分实例
    `#${props.boxCls}`,
  )

  myGridStack.on('dragstop', (event, el) => {
    nextTick(() => {
      // 更新位置
      gridData.value = getSaveLayout()
    })
  })
  myGridStack.on('resizestop', (event, el) => {
    nextTick(() => {
      // 更新位置
      gridData.value = getSaveLayout()
    })
    // 更新位置
    /* gridData.value = getSaveLayout().map((item) => {
      return {
        w: item.minW,
        h: item.minH,
        id: item.id,
        mark: `grid-item-${item.id}`,
        x: item.x,
        y: item.y,
      }
    })*/
  })
  // 添加新的网格项时
  /* myGridStack.on('added', (event, items) => {
    items.forEach((item) => {
      let widget = gridData.value.find((w) => +w.id === +item.id)
      console.log(widget, 'add-widget')
      if (widget) {
        widget.x = item.x
        widget.y = item.y
      } else {
        const node = {
          x: item.x,
          y: item.y,
          w: item.w,
          h: item.h,
          id: item.id,
          mark: `grid-item-${item.id}`,
        }
        console.log(node, 'node')
        gridData.value.push(node)
        myGridStack.removeWidget(item.el)
        makeLayout(node.mark)
      }
    })
  })*/

  myGridStack.on('dropped', (event, previousWidget, newWidget) => {
    gridData.value = getSaveLayout()
    myGridStack.removeWidget(newWidget.el)
    makeLayout(`grid-item-${newWidget.id}`)
  })
  bool && setExternalDrag()
}

watch(
  gridData,
  debounce((val) => {
    console.log(val, 'gridData')
    initLayout()
  }),
  {
    deep: true,
  },
)

defineExpose({
  initLayout,
  makeLayout,
  reloadLayout,
  getSaveLayout,
  getMyGridStack,
  setExternalDrag,
})

defineOptions({
  name: 'GridLayout',
})
</script>

<style scoped lang="scss">
.grid-stack {
  background: #fafad2;
}

.grid-stack-item-content {
  text-align: center;
  background-color: #18bc9c;
  overflow: hidden !important;
}

.grid-stack-item-removing {
  opacity: 0.5;
}

.trash {
  height: 100px;
  background: rgba(255, 0, 0, 0.1) center center
    url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjY0cHgiIGhlaWdodD0iNjRweCIgdmlld0JveD0iMCAwIDQzOC41MjkgNDM4LjUyOSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDM4LjUyOSA0MzguNTI5OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTQxNy42ODksNzUuNjU0Yy0xLjcxMS0xLjcwOS0zLjkwMS0yLjU2OC02LjU2My0yLjU2OGgtODguMjI0TDMwMi45MTcsMjUuNDFjLTIuODU0LTcuMDQ0LTcuOTk0LTEzLjA0LTE1LjQxMy0xNy45ODkgICAgQzI4MC4wNzgsMi40NzMsMjcyLjU1NiwwLDI2NC45NDUsMGgtOTEuMzYzYy03LjYxMSwwLTE1LjEzMSwyLjQ3My0yMi41NTQsNy40MjFjLTcuNDI0LDQuOTQ5LTEyLjU2MywxMC45NDQtMTUuNDE5LDE3Ljk4OSAgICBsLTE5Ljk4NSw0Ny42NzZoLTg4LjIyYy0yLjY2NywwLTQuODUzLDAuODU5LTYuNTY3LDIuNTY4Yy0xLjcwOSwxLjcxMy0yLjU2OCwzLjkwMy0yLjU2OCw2LjU2N3YxOC4yNzQgICAgYzAsMi42NjQsMC44NTUsNC44NTQsMi41NjgsNi41NjRjMS43MTQsMS43MTIsMy45MDQsMi41NjgsNi41NjcsMi41NjhoMjcuNDA2djI3MS44YzAsMTUuODAzLDQuNDczLDI5LjI2NiwxMy40MTgsNDAuMzk4ICAgIGM4Ljk0NywxMS4xMzksMTkuNzAxLDE2LjcwMywzMi4yNjQsMTYuNzAzaDIzNy41NDJjMTIuNTY2LDAsMjMuMzE5LTUuNzU2LDMyLjI2NS0xNy4yNjhjOC45NDUtMTEuNTIsMTMuNDE1LTI1LjE3NCwxMy40MTUtNDAuOTcxICAgIFYxMDkuNjI3aDI3LjQxMWMyLjY2MiwwLDQuODUzLTAuODU2LDYuNTYzLTIuNTY4YzEuNzA4LTEuNzA5LDIuNTctMy45LDIuNTctNi41NjRWODIuMjIxICAgIEM0MjAuMjYsNzkuNTU3LDQxOS4zOTcsNzcuMzY3LDQxNy42ODksNzUuNjU0eiBNMTY5LjMwMSwzOS42NzhjMS4zMzEtMS43MTIsMi45NS0yLjc2Miw0Ljg1My0zLjE0aDkwLjUwNCAgICBjMS45MDMsMC4zODEsMy41MjUsMS40Myw0Ljg1NCwzLjE0bDEzLjcwOSwzMy40MDRIMTU1LjMxMUwxNjkuMzAxLDM5LjY3OHogTTM0Ny4xNzMsMzgwLjI5MWMwLDQuMTg2LTAuNjY0LDguMDQyLTEuOTk5LDExLjU2MSAgICBjLTEuMzM0LDMuNTE4LTIuNzE3LDYuMDg4LTQuMTQxLDcuNzA2Yy0xLjQzMSwxLjYyMi0yLjQyMywyLjQyNy0yLjk5OCwyLjQyN0gxMDAuNDkzYy0wLjU3MSwwLTEuNTY1LTAuODA1LTIuOTk2LTIuNDI3ICAgIGMtMS40MjktMS42MTgtMi44MS00LjE4OC00LjE0My03LjcwNmMtMS4zMzEtMy41MTktMS45OTctNy4zNzktMS45OTctMTEuNTYxVjEwOS42MjdoMjU1LjgxNVYzODAuMjkxeiIgZmlsbD0iI2ZmOWNhZSIvPgoJCTxwYXRoIGQ9Ik0xMzcuMDQsMzQ3LjE3MmgxOC4yNzFjMi42NjcsMCw0Ljg1OC0wLjg1NSw2LjU2Ny0yLjU2N2MxLjcwOS0xLjcxOCwyLjU2OC0zLjkwMSwyLjU2OC02LjU3VjE3My41ODEgICAgYzAtMi42NjMtMC44NTktNC44NTMtMi41NjgtNi41NjdjLTEuNzE0LTEuNzA5LTMuODk5LTIuNTY1LTYuNTY3LTIuNTY1SDEzNy4wNGMtMi42NjcsMC00Ljg1NCwwLjg1NS02LjU2NywyLjU2NSAgICBjLTEuNzExLDEuNzE0LTIuNTY4LDMuOTA0LTIuNTY4LDYuNTY3djE2NC40NTRjMCwyLjY2OSwwLjg1NCw0Ljg1MywyLjU2OCw2LjU3QzEzMi4xODYsMzQ2LjMxNiwxMzQuMzczLDM0Ny4xNzIsMTM3LjA0LDM0Ny4xNzJ6IiBmaWxsPSIjZmY5Y2FlIi8+CgkJPHBhdGggZD0iTTIxMC4xMjksMzQ3LjE3MmgxOC4yNzFjMi42NjYsMCw0Ljg1Ni0wLjg1NSw2LjU2NC0yLjU2N2MxLjcxOC0xLjcxOCwyLjU2OS0zLjkwMSwyLjU2OS02LjU3VjE3My41ODEgICAgYzAtMi42NjMtMC44NTItNC44NTMtMi41NjktNi41NjdjLTEuNzA4LTEuNzA5LTMuODk4LTIuNTY1LTYuNTY0LTIuNTY1aC0xOC4yNzFjLTIuNjY0LDAtNC44NTQsMC44NTUtNi41NjcsMi41NjUgICAgYy0xLjcxNCwxLjcxNC0yLjU2OCwzLjkwNC0yLjU2OCw2LjU2N3YxNjQuNDU0YzAsMi42NjksMC44NTQsNC44NTMsMi41NjgsNi41N0MyMDUuMjc0LDM0Ni4zMTYsMjA3LjQ2NSwzNDcuMTcyLDIxMC4xMjksMzQ3LjE3MnogICAgIiBmaWxsPSIjZmY5Y2FlIi8+CgkJPHBhdGggZD0iTTI4My4yMiwzNDcuMTcyaDE4LjI2OGMyLjY2OSwwLDQuODU5LTAuODU1LDYuNTctMi41NjdjMS43MTEtMS43MTgsMi41NjItMy45MDEsMi41NjItNi41N1YxNzMuNTgxICAgIGMwLTIuNjYzLTAuODUyLTQuODUzLTIuNTYyLTYuNTY3Yy0xLjcxMS0xLjcwOS0zLjkwMS0yLjU2NS02LjU3LTIuNTY1SDI4My4yMmMtMi42NywwLTQuODUzLDAuODU1LTYuNTcxLDIuNTY1ICAgIGMtMS43MTEsMS43MTQtMi41NjYsMy45MDQtMi41NjYsNi41Njd2MTY0LjQ1NGMwLDIuNjY5LDAuODU1LDQuODUzLDIuNTY2LDYuNTdDMjc4LjM2NywzNDYuMzE2LDI4MC41NSwzNDcuMTcyLDI4My4yMiwzNDcuMTcyeiIgZmlsbD0iI2ZmOWNhZSIvPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=)
    no-repeat;
}

/* make nested grid have slightly darker bg take almost all space (need some to tell them apart) so items inside can have similar to external size+margin */
.grid-stack > .grid-stack-item.grid-stack-sub-grid > .grid-stack-item-content {
  background: rgba(0, 0, 0, 0.1);
  inset: 0 2px;
}

.grid-stack.grid-stack-nested {
  background: none;
  /* background-color: red; */
  /* take entire space */
  position: absolute;
  inset: 0; /* TODO change top: if you have content in nested grid */
}
</style>
