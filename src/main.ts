import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'

import { Button, Toast } from 'vant'

const app = createApp(App)


app.use(store)
    .use(router)
    .use(Button)
    .use(Toast)
    .mount('#app')