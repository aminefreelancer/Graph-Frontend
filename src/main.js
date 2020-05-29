import Vue from 'vue'
import router from './router'
import App from './App.vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import D3Network from 'vue-d3-network'

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(D3Network)
new Vue({
  components: {
      D3Network
  },
  router,
  render: h => h(App),
  
}).$mount('#app')
