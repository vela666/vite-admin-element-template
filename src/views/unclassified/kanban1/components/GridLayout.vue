<template>
  <div :id="boxCls"></div>
</template>

<script setup>
import { h, render, computed, watch, nextTick, useSlots } from 'vue'
import GridContent from './GridContent.vue'
import 'gridstack/dist/gridstack.min.css'
import { GridStack } from 'gridstack'
import { debounce } from 'lodash-es'

const props = defineProps({
  // 已知问题 h设为1时 获取不到 h字段  h和w  minH和minW 必须有一对 一般minH和minW就行了
  // [{id: '1', w: 6, h: 4, x: 0, y: 10}]
  modelValue: {
    type: Array,
    default: () => [],
  },
  dragData: {
    type: Array,
    default: () => [],
  },
  noResize: {
    type: Boolean,
    default: false,
  },
  noDrag: {
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
  minRow: {
    type: Number,
    default: 0,
  },
  // 外部拖拽的容器类名(选择器（例如'.sidebar .grid-stack-item')
  externalDragIn: {
    type: String,
    default: '',
  },
  // 指定拖动的类名 .handler
  externalDragHandle: {
    type: String,
    default: '.drag-handle',
  },
})

const emit = defineEmits(['update:modelValue', 'layoutChange'])

const slots = useSlots()

// 不要使用 ref(null) 作为代理 在比较结构时会破坏所有逻辑.
// see https://github.com/gridstack/gridstack.js/issues/2115
let myGridStack = null
let requestIdleCallbackId = null
const gridOptions = {
  // animate: false,
  // float: false,
  // 不初始化项目
  // cellHeightThrottle: 500,
  auto: false,
  cellHeight: props.cellHeight + 'px',
  disableResize: props.noResize,
  disableDrag: props.noDrag,
  // 只有该类名的元素才能拖动
  // handleClass: props.dragHandle,
  // handle: '.card-header',
  margin: props.margin,
  resizable: {
    // 只允许从某个方向调整大小
    // s 下,n 上,ne 右上,e 右边,se 右下,sw 左下,w 左边,nw 左上
    handles: 's',
  },
  column: 12,
  // 最小行数，防止网格在空时崩溃。
  minRow: props.minRow,
  styleInHead: true,
  disableOneColumnMode: true,
  // 接受从其他网格或外部拖动的元素
  acceptWidgets(el) {
    return true
  },
}

const gridData = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const layoutData = computed(() => {
  return [...gridData.value, ...props.dragData]
})

// 重新布局
const updLayout = () => {
  nextTick(() => {
    // 重新布局
    myGridStack.compact()
  })
}

const makeLayout = (node) => {
  nextTick(() => {
    myGridStack.addWidget(node)
  })
}

const findGridData = (id) => {
  return layoutData.value.find((val) => val.id === id)
}

const getSaveLayout = (saveContent = false, saveGridOpt = false) => {
  return myGridStack.save(saveContent, saveGridOpt)
  /*return myGridStack.getGridItems().map((item) => {
    const id = item.getAttribute('gs-id')
    const w = +item.getAttribute('gs-w') || 6
    const h = +item.getAttribute('gs-h') || 1
    const x = +item.getAttribute('gs-x')
    const y = +item.getAttribute('gs-y')
    const node = {
      ...findGridData(id),
      id,
      w,
      h,
      x,
      y,
      // minH: h,
    }
    return node
  })*/
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
  if (!props.externalDragIn) return
  requestIdleCallbackId && window.cancelIdleCallback(requestIdleCallbackId)
  requestIdleCallbackId = window.requestIdleCallback(
    () => {
      GridStack.setupDragIn(props.externalDragIn, {
        appendTo: 'body',
        handle: props.externalDragHandle,
        helper(event) {
          return event.target.cloneNode(true)
        },
      })
    },
    {
      timeout: 300,
    },
  )
}

// 加载布局
const reloadLayout = (data = gridData.value) => {
  nextTick(() => {
    myGridStack.load(data)
    setExternalDrag()
  })
}

const updLayoutData = debounce(() => {
  nextTick(() => {
    setExternalDrag()
    // 更新位置
    gridData.value = getSaveLayout()
    emit('layoutChange')
  })
})

const operateHandler = (obj = {}) => {
  const { el = '', type = '', val } = obj
  switch (type) {
    case 'remove':
      myGridStack.removeWidget(el)
      break
    case 'update':
      // val = {w: 12, h: 2, x: 0, y: 4, noResize: false } 任意一个字段 等
      console.log(el)
      myGridStack.update(el, {
        w: 12,
      })
      updLayoutData()
      break
    case 'move':
      // 支持外部拖入的时不需要执行
      if (!props.externalDragIn) {
        myGridStack.enableMove(val)
      }
      break
    // 启用/禁用元素的大小
    case 'resize':
      myGridStack.resizable(el, val)
      updLayoutData()
      break
  }
}

const initLayout = () => {
  // https://github.com/gridstack/gridstack.js/tree/master/doc#resizableel-val
  // 不要使用 grid.value = GridStack.init()
  myGridStack?.destroy(false)
  myGridStack = GridStack.init(
    gridOptions,
    // 指定容器区分实例
    `#${props.boxCls}`,
  )
  //更改位置/大小
  myGridStack.on(
    'change',
    debounce((event, items) => {
      console.log('change')
      updLayoutData()
    }),
  )
  // 添加
  myGridStack.on('added', (event, items) => {
    console.log(items, 'added')
    for (const item of items) {
      const itemEl = item.el
      // 不要改这个选择器
      // const itemElContent = itemEl.querySelector('.grid-stack-item-content')
      // 获取第一个 div
      //  itemEl.querySelectorAll('div')[0]
      const itemElContent = itemEl.querySelector('div')
      const itemId = item.id
      // Use Vue's render function to create the content
      // See https://vuejs.org/guide/extras/render-function.html#render-functions-jsx
      // Supports: emit, slots, props, attrs, see onRemove event below
      const itemContentVNode = h(
        GridContent,
        {
          item: findGridData(itemId),
          handleClass: props.dragHandle,
          onOperateHandler(args) {
            operateHandler({
              el: itemEl,
              ...args,
            })
          },
        },
        // 插槽
        slots,
      )
      // Render the vue node into the item element
      render(itemContentVNode, itemElContent)
    }
    updLayoutData()
  })

  // 删除
  myGridStack.on('removed', (event, items) => {
    console.log('removed')
    for (const item of items) {
      // const itemElContent = item.el.querySelector('.grid-stack-item-content')
      const itemElContent = item.el.querySelector('div')
      // Unmount the vue node from the item element
      // Calling render with null will allow vue to clean up the DOM, and trigger lifecycle hooks
      render(null, itemElContent)
    }
    updLayoutData()
  })
  // 拖动停止
  myGridStack.on('dragstop', (event, el) => {
    console.log('dragstop')
    operateHandler({
      type: 'move',
      val: false,
    })
  })
  // 外部拖拽进入
  myGridStack.on('dropped', (event, previousWidget, newWidget) => {
    // 如果 setupDragIn 用了helper 则需要执行该函数
    // myGridStack.removeWidget(newWidget.el)
    console.log('dropped')
    operateHandler({
      el: newWidget.el,
      type: 'remove',
    })
    makeLayout({
      ...findGridData(newWidget.id),
      x: newWidget.x,
      y: newWidget.y,
      // w: newWidget.w,
      // h: newWidget.h,
      // id: newWidget.id,
      // minH: newWidget.h,
    })
  })

  reloadLayout()
}

/*watch(
  gridData,
  debounce((val) => {
    console.log(val, 'gridData')
  }),
  {
    deep: true,
  },
)*/

defineExpose({
  updLayout,
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

<style lang="scss">
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
