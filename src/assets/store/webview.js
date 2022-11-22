import Vue from 'vue';

// 小型 Vuex，全局状态管理
export const webviewStore = Vue.observable({
  isSmallWindow: false, // 是否开启了小窗口模式
  isPortrait: false // 是否为竖屏比例
});
