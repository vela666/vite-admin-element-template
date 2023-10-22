import dayjs from 'dayjs'
import zhCn from 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'
import isBetween from 'dayjs/plugin/isBetween'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'
import isoWeek from 'dayjs/plugin/isoWeek'
// import weekday from 'dayjs/plugin/weekday'

// 设置了中文语言 获取weekday受设置的语言影响 使用 dayjs().isoWeekday() 或 dayjs().day()
dayjs.locale(zhCn)
dayjs.extend(isBetween)
dayjs.extend(relativeTime)
dayjs.extend(isoWeek)
dayjs.extend(quarterOfYear)
// dayjs.extend(weekday)
