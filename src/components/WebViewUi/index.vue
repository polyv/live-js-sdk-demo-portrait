<template>
  <div class="c-small-window-ui">
    <div class="c-small-window-ui__webview__header">
      <button class="c-small-window-ui__webview__back-btn" @click="handleWebviewBack"></button>
      <button class="c-small-window-ui__webview__close-btn" @click="handleWebviewClose"></button>
    </div>
    <div class="c-small-window-ui__webview__main" @click="() => $emit('clickMain')">
      <div v-show="playerButtonVisible" class="c-small-window-ui__webview__btn__play"></div>
    </div>
  </div>
</template>

<script>
import webviewBase from '../../components/WebViewUi/mixins/webviewBase';
import { webviewStore } from '../../assets/store/webview';

export default {
  name: 'index',
  mixins: [webviewBase],
  props: ['playerButtonVisible'],
  methods: {
    // 切换常规屏幕
    handleWebviewBack() {
      webviewStore.isSmallWindow = false;
      this.webviewBridge && this.webviewBridge.sendData('changeToNormal');
    },
    // 关闭小窗
    handleWebviewClose() {
      localStorage.clear();
      this.webviewBridge && this.webviewBridge.sendData('closeWindow');
    },
  }
};
</script>

<style>
.c-small-window-ui {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
}
.c-small-window-ui__webview__header {
  z-index: 1;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 24px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.c-small-window-ui__webview__back-btn,
.c-small-window-ui__webview__close-btn {
  width: 24px;
  height: 24px;
  background-color: transparent;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  border: none;
}
.c-small-window-ui__webview__back-btn {
  background-image: url(./imgs/back-btn.png);
}
.c-small-window-ui__webview__close-btn {
  background-image: url(./imgs/close-btn.png);
}

.c-small-window-ui__webview__main {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
.c-small-window-ui__webview__btn__play {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 32px;
  height: 32px;
  background-size: cover;
  background-position: center;
  background-image: url(./imgs/play-btn.png);
}
</style>
