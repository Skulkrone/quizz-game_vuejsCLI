import { createApp } from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import App from './App.vue'

// pour requête http via appel api : utilisation de Axios
// https://www.npmjs.com/package/vue-axios

createApp(App)
.use(VueAxios, axios)
.mount('#app')

