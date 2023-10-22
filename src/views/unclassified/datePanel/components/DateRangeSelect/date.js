import dayjs from 'dayjs'
export const dateFormat1 = 'YYYY-MM-DD'
export const currentDate = dayjs()
export const startDate1 = currentDate.subtract(7, 'day').format(dateFormat1)
// 计算过去7天的日期
export const endDate1 = currentDate.subtract(1, 'day').format(dateFormat1)

export const dateRange1 = {
  date: [startDate1, endDate1],
  diff: '1-7',
}
