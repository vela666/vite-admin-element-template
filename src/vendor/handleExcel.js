import { saveAs } from 'file-saver'

// 该方式在webpack4中 需要配合 worker-loader使用
// import exportExcelWorker from '@/workers/exportExcel.worker'
// 导出excel 可设置单元格样式等
/*data = {
  fileName: '文件名',
  // 多个工作表
  sheets: [
    {
      sheetName: '工作表名字 可选',
      sheetData: [
        ['2023-05-21\n2023-05-28', 'A2', 'A3'],
        ['A2', 'B2'],
        ['A3', 'B3', 'C3']
      ]
    },
    {
      sheetName: '工作表名字 可选',
      sheetData: [['A1', 'B1', 'C1'], ['A2', 'B2'], ['A3']]
    }
  ]
  // 单个工作表
  sheets: {
    // sheetName: '工作表名字 可选',
    sheetData: [['A1', 'B1', 'C1'], ['A2', 'B2'], ['A3']]
  }
}*/
export function exportToExcel(data) {
  // 该方式在webpack4中 需要配合 worker-loader使用
  // let myWorker = new exportExcelWorker()
  // webpack5和vite的使用方式
  let myWorker = new Worker(
    new URL('@/workers/exportExcel.worker.js', import.meta.url),
    {
      type: 'module',
    },
  )

  // 发送数据给 Web Worker 进行处理
  myWorker.postMessage(JSON.stringify(data))

  // 监听 Web Worker 的返回结果
  myWorker.onmessage = (event) => {
    try {
      saveAs(new Blob([event.data]), `${data.fileName}.xlsx`)
    } catch (err) {
      console.log(`excel导出失败，原因为：${err}`)
    }
    // 关闭 Web Worker
    myWorker.terminate()
  }
}
// 解析导入的excel  file = 上传文件file对象
export async function importExcel(file) {
  return new Promise((resolve) => {
    let myWorker = new Worker(
      new URL('@/workers/importExcel.worker.js', import.meta.url),
      {
        type: 'module',
      },
    )

    // 发送数据给 Web Worker 进行处理
    myWorker.postMessage(file)

    // 监听 Web Worker 的返回结果
    myWorker.onmessage = (event) => {
      resolve(event.data)
      // 关闭 Web Worker
      myWorker.terminate()
    }
  })
}
