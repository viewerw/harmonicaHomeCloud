import Vue from 'vue';
import App from '@/App';
import store from '@/store';

import cuCustom from './colorui/components/cu-custom';
import tutorial from './pages/tutorial';
import score from './pages/score';
import social from './pages/social';
import mine from './pages/mine';

Vue.component('cu-custom', cuCustom);
Vue.component('tutorial', tutorial);
Vue.component('score', score);
Vue.component('social', social);
Vue.component('mine', mine);
Vue.config.productionTip = false;

const app = new Vue({
    mpType: 'app',
    store,
    ...App,
});
app.$mount();
