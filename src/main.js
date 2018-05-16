// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import { store } from './store'
import 'vuetify/dist/vuetify.min.css'
import Loading from 'vue-loading-overlay'

import 'vue-loading-overlay/dist/vue-loading.min.css'

Vue.use(Vuetify, { theme: {
  primary: '#1565C0',
  secondary: '#424242',
  accent: '#82B1FF',
  error: '#FF5252',
  info: '#2196F3',
  success: '#4CAF50',
  warning: '#FFC107'
}})

Vue.use(Loading)

Vue.prototype.$app_id = 'tOPDP4GqwPojCCApkMyA'
Vue.prototype.$app_code = 'B31er-cbmC_bBOoupZ_O2g'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
