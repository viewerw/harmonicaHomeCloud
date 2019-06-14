import Vue from 'vue';
import App from '@/App';
import store from '@/store';

Vue.config.productionTip = false;

const app = new Vue({
  mpType: 'app',
  store,
  ...App,
});
app.$mount();
