import Vue from 'vue';
import App from '@/App';
import store from '@/store';

import cuCustom from './colorui/components/cu-custom';

Vue.component('cu-custom', cuCustom);
Vue.config.productionTip = false;

const app = new Vue({
    mpType: 'app',
    store,
    ...App,
});
app.$mount();
