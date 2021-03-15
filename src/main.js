import Vue from 'vue'
import "@/styles/index.scss"
import Fit2CloudUI from 'fit2cloud-ui';
// import Fit2CloudUI from './external/fit2cloud-ui.common';
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

Vue.config.productionTip = false

Vue.use(ElementUI, {
  size: 'medium',
  i18n: (key, value) => i18n.t(key, value)
});
Vue.use(Fit2CloudUI, {
  i18n: (key, value) => i18n.t(key, value)
});
Vue.use(icons);
Vue.use(plugins);
Vue.use(directives);
Vue.use(filters);

new Vue({
  el: '#app',
  i18n,
  router,
  store,
  render: h => h(App),
})
