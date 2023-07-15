// https://github.com/exceljs/exceljs/blob/master/README_zh.md
import ExcelJS from 'exceljs'
import { isDate } from '@/utils/validate'
import dayjs from 'dayjs'

// 处理日期格式
const handleDateFormats = (value, format = 'YYYY-MM-DD') =>
  dayjs(value).format(format)

self.onmessage = async (event) => {
  const reader = new FileReader()
  const excelData = []
  const excelColumns = []
  let error = ''
  reader.onload = async function (e) {
    const arrayBuffer = e.target.result
    try {
      // 使用exceljs解析Excel数据
      let workbook = new ExcelJS.Workbook()

      await workbook.xlsx.load(arrayBuffer)

      // 假设Excel文件中的数据在第一个工作表中
      const worksheet = workbook.getWorksheet(1)
      // 获取第一行
      worksheet.getRow(1).eachCell((cell, colNumber) => {
        excelColumns.push({
          // fixed: true,
          label: isDate(cell.value)
            ? handleDateFormats(cell.value)
            : cell.value,
          prop: 'col_' + (colNumber - 1),
        })
      })
      // 遍历每一行（跳过第一行）
      for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
        const row = worksheet.getRow(rowNumber)
        const rowData = {}

        // 遍历每一列
        for (let colNumber = 1; colNumber <= excelColumns.length; colNumber++) {
          const key = excelColumns[colNumber - 1].prop
          const cell = row.getCell(colNumber)
          // 使用第一行的值作为键
          rowData[key] = isDate(cell.value)
            ? handleDateFormats(cell.value)
            : cell.value || '-'
        }

        // 将行数据添加到JSON数组
        excelData.push(rowData)
      }
    } catch (e) {
      error = '读取Excel文件出错:' + e.message
    }
    // 完成 Excel 处理后，将结果发送回主线程
    self.postMessage({
      excelData,
      excelColumns,
      error,
    })
  }
  reader.readAsArrayBuffer(event.data)
}
