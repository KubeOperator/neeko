import Vue from 'vue'
import "@/styles/index.scss"
import "@/assets/iconfont/iconfont"
import '@/assets/iconfont/iconfont.css'
import Fit2CloudUI from 'fit2cloud-ui'
// import Fit2CloudUI from './external/fit2cloud-ui.common';
import {library} from '@fortawesome/fontawesome-svg-core'
import {fas} from '@fortawesome/free-solid-svg-icons'
import {far} from '@fortawesome/free-regular-svg-icons'
import {fab} from '@fortawesome/free-brands-svg-icons'
import {FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText} from '@fortawesome/vue-fontawesome'


import ElementUI from 'element-ui';
import App from './App.vue'
import i18n from "./i18n";
import router from './router'
import store from './store'
import icons from './icons'
import plugins from "./plugins";
import directives from "./directive";
import filters from "./filters";
import "./permission"
import VueCodemirror from 'vue-codemirror';
import 'codemirror/lib/codemirror.css';
Vue.config.productionTip = false

import echarts from "echarts";
Vue.prototype.$echarts = echarts;

Vue.use(ElementUI, {
  size: 'small',
  i18n: (key, value) => i18n.t(key, value)
});
Vue.use(Fit2CloudUI, {
  i18n: (key, value) => i18n.t(key, value)
});
library.add(fas, far, fab)

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('font-awesome-layers', FontAwesomeLayers)
Vue.component('font-awesome-layers-text', FontAwesomeLayersText)
Vue.use(icons);
Vue.use(plugins);
Vue.use(directives);
Vue.use(filters);
Vue.use(VueCodemirror)

Vue.directive("preventReClick", {
  inserted(el, binding) {
    el.addEventListener("click", () => {
      el.style.pointerEvents = "none"
      if (!el.disabled) {
        setTimeout(() => {
          el.style.pointerEvents = "auto"
        }, binding.value || 1000)
      }
    })
  }
})

new Vue({
  el: '#app',
  i18n,
  router,
  store,
  render: h => h(App),
})
