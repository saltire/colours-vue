import Vue from 'vue';
import VueResource from 'vue-resource';

import App from '../vue/app.vue';


Vue.use(VueResource);

const app = new Vue({
    el: '#colors',
    render: createElement => createElement(App)
});
