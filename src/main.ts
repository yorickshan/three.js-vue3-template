import { createApp } from 'vue'
import './tailwind.css'
import App from './App.vue'
import { routes } from './routes'
import { createRouter, createWebHistory } from 'vue-router'

const app = createApp(App)

const router = createRouter({
  // In the Vue Router 4, set base path by history api
  history: createWebHistory(import.meta.env.VITE_APP_BASE_URL),
  routes,
})

app.use(router)
app.mount('#app')
