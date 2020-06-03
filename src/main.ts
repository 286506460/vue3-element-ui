import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './theme/src/index.scss'
import './views/demo.css'

createApp(App as any)
	.use(router)
	.mount('#app')
