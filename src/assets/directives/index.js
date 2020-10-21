import clickOutSide from './click-out-side';

export default {
  install: function(Vue) {
    Vue.directive('click-out-side', clickOutSide);
  }
};
