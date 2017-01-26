import Sortable from 'sortablejs';
import Vue from 'vue';
import VueResource from 'vue-resource';

import App from '../vue/app.vue';


Vue.use(VueResource);

Vue.directive('sortable', {
    inserted(el, binding) {
        new Sortable(el, binding.value || {});
    }
});

const app = new Vue({
    el: '#colors',
    render: createElement => createElement(App)
});
