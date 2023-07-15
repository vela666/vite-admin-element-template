import {
  arrow,
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
  hide,
} from '@floating-ui/dom'

export function updatePosition(current, target, floatingOffset, arrowEl) {
  computePosition(current, target, {
    placement: 'top',
    strategy: 'fixed', // 'absolute' by default
    middleware: [
      flip(),
      shift(),
      offset(floatingOffset),
      arrow({ element: arrowEl }),
      hide(),
    ],
  }).then(({ x, y, middlewareData, placement }) => {
    const { referenceHidden } = middlewareData.hide
    Object.assign(target.style, {
      left: `${x}px`,
      top: `${y}px`,
      display: referenceHidden ? 'none' : 'flex',
    })

    const side = placement.split('-')[0]

    const staticSide = {
      top: 'bottom',
      right: 'left',
      bottom: 'top',
      left: 'right',
    }[side]

    if (middlewareData.arrow) {
      const { x, y } = middlewareData.arrow
      Object.assign(arrowEl.style, {
        left: !isNaN(x) ? `${x}px` : '',
        top: !isNaN(y) ? `${y}px` : '',
        // Ensure the static side gets unset when
        // flipping to other placements' axes.
        right: '',
        bottom: '',
        [staticSide]: `${-arrowEl.offsetWidth / 2}px`,
        transform: 'rotate(45deg)',
        background: 'black',
      })
    }
  })
}
export function autoUpdateElementPos(current, target, arrowEl) {
  const floatingOffset = Math.sqrt(2 * arrowEl.offsetWidth ** 2) / 2
  const cleanup = autoUpdate(
    current,
    target,
    () => {
      updatePosition(current, target, floatingOffset, arrowEl)
    },
    {
      // ancestorScroll: false,
    },
  )
  /* // Intersection Observer 回调函数
      const callback = (entries, observer) => {
        entries.forEach((entry) => {
          console.log(entry.isIntersecting)
          if (entry.isIntersecting) {
            // 元素进入可视区
            console.log('元素进入可视区')
            // 在回调函数中移除观察
            observer.unobserve(targetElement);

            // 重新执行监听
            observer.observe(targetElement);
          } else {
            // 元素离开可视区
            console.log('元素离开可视区')
          }
        })
      }

      // Intersection Observer 配置选项
      const options = {
        root: null, // 根元素，默认为视口
        rootMargin: '0px', // 根元素的边距
        threshold: 0.5, // 可视比例阈值，0.5 表示当目标元素 50% 可见时触发回调
      }

      // 创建 Intersection Observer 对象
      const observer = new IntersectionObserver(callback, options)

      // 观察目标元素
      observer.observe(current)*/
  return cleanup
}

export function hasClass(el, cls) {
  return !!el.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

export function addClass(el, cls, extracls) {
  if (!hasClass(el, cls)) el.className += ' ' + cls
  if (extracls) {
    if (!hasClass(el, extracls)) el.className += ' ' + extracls
  }
}

export function removeClass(el, cls, extracls) {
  if (hasClass(el, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    el.className = el.className.replace(reg, ' ').trim()
  }
  if (extracls) {
    if (hasClass(el, extracls)) {
      const regs = new RegExp('(\\s|^)' + extracls + '(\\s|$)')
      el.className = el.className.replace(regs, ' ').trim()
    }
  }
}

export function toggleClass(flag, clsName, target) {
  const targetEl = target || document.body
  let { className } = targetEl
  className = className.replace(clsName, '')
  targetEl.className = flag ? `${className} ${clsName} ` : className
}
