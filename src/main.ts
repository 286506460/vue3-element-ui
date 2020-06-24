import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './theme/src/index.scss'
import './views/demo.css'
import VueNextEventPlugin from 'vue-next-event-plugin'

const app = createApp(App as any)

app.use(router)
app.use(VueNextEventPlugin)
app.mount('#app')
