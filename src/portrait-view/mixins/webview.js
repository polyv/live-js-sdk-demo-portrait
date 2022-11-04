import { isWebView } from '@polyv/web-view-bridge';
import { initWebView } from '../../assets/utils/webview';
import webviewBase from '../../components/WebViewUi/mixins/webviewBase';
const pageSmallWindowClass = 'p-watch--small-window';

export default {
  mixins: [webviewBase],
  watch: {
    isSmallWindow(value) {
      if (value) {
        document.body.classList.add(pageSmallWindowClass);
      } else {
        document.body.classList.remove(pageSmallWindowClass);
      }
      // 需延迟调用切换播放器等大小
      setTimeout(() => {
        this.playerCtrl && this.playerCtrl.setVideoSize();
        this.playerCtrl && this.playerCtrl.setImgSize('.c-player__container .plv-cover-box');
      }, 200);
    }
  },
  methods: {
    // 初始化需要绑定的事件
    handleInitBindWebViewEvent() {
      const { webviewBridge, handleChangeToSmall, handleChangeToNormal } = this;
      // 监听切换小窗口事件
      webviewBridge && webviewBridge.on('changeToSmall', handleChangeToSmall);
      // 监听切换正常窗口事件
      webviewBridge && webviewBridge.on('changeToNormal', handleChangeToNormal);
    },
    // 销毁事件
    handleRemoveWebViewEvent() {
      const { webviewBridge, handleChangeToSmall, handleChangeToNormal } = this;
      webviewBridge && webviewBridge.off('changeToSmall', handleChangeToSmall);
      webviewBridge && webviewBridge.off('changeToNormal', handleChangeToNormal);
    },
    // 监听到小窗口模式
    handleChangeToSmall(data = {}) {
      this.isSmallWindow = true;
      if (data?.isPIP) {
        // IOS小窗模式下，需暂停web播放
        this.playerCtrl && this.playerCtrl.pause();
      }
    },
    // 监听到正常窗口模式
    handleChangeToNormal(data = {}) {
      this.isSmallWindow = false;
      if (data?.isPIP) {
        // IOS下，需恢复web播放
        this.playerCtrl && this.playerCtrl.resume();
      }
    },
    handleResize() {
      setTimeout(() => {
        this.$refs.swiper && this.$refs.swiper.$swiper.update(true);
      }, 200);
    },
    // 处理发生跳转的情况
    async handleBeforeUnload() {
      if (this.isSmallWindow) {
        await this.waitForRecover();
      }
    },
    sendInitInfo() {
      this.webviewBridge && this.webviewBridge.sendData('getLiveUserInfo', {
        userId: '1ac7bd0157',
        channelId: 3450250,
        customParam: {
          liveParam1: 'guest', // 用户id,
          liveParam2: 'guest',
          liveParam3: '',
          liveParam4: '',
          liveParam5: '',
        }
      });
    },

    // 从小窗恢复常规样式
    waitForRecover() {
      this.webviewBridge && this.webviewBridge.sendData('changeToNormal');
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 200);
      });
    },
  },
  async mounted() {
    // 是否为 plvwebviewapp 环境
    if (isWebView()) {
      await initWebView();
      this.handleInitBindWebViewEvent();
      this.sendInitInfo();
      window.addEventListener('resize', this.handleResize);
      window.addEventListener('beforeunload', this.handleBeforeUnload);
      this.$once('hook:beforeDestroy', () => {
        this.handleRemoveWebViewEvent();
        window.removeEventListener('resize', this.handleResize);
      });
    }
  }
};
