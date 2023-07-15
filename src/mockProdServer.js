import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer'
/*
import userMock from '../mock/user'
import demoMock from '../mock/demo'
import articleMock from '../mock/article'
export const mockModules = [...userMock, ...demoMock, ...articleMock]

export function setupProdMockServer() {
  createProdMockServer(mockModules)
}
*/

const mocks = []
const mockContext = import.meta.glob('../mock/*.js', { eager: true })
Object.keys(mockContext).forEach((v) => {
  mocks.push(...mockContext[v].default)
})

export function setupProdMockServer() {
  console.log('mocks', mocks)
  createProdMockServer(mocks)
}
