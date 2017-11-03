import Sortable from 'sortablejs';
import Vue from 'vue';

import App from '../vue/app.vue';


Vue.directive('sortable', {
  inserted(el, binding) {
    return new Sortable(el, binding.value || {});
  },
});

export default new Vue({
  el: '#colors',
  render: createElement => createElement(App),
});
