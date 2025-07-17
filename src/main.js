import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

console.log('--- Aplikasi Vue Dimulai ---'); // Tambahkan baris ini

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
  components,
  directives,
  defaults: {
    global: {
      style: {
        fontFamily: 'Inter, sans-serif',
      },
    },
  },
})

const app = createApp(App)

// Initialize store with user data from localStorage if available
const userData = JSON.parse(localStorage.getItem('user') || '{}');
if (userData.username) {
  store.dispatch('login', {
    user: userData,
    role: userData.role // Single role
  });
}

app.use(router)
app.use(store)
app.use(vuetify)
app.mount('#app')