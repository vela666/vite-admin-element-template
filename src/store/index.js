import { createPinia } from 'pinia'

const store = createPinia()

export function registerStore(app) {
  app.use(store)
}
