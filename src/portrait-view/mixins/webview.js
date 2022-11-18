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
    },
    channelDetail(newValue) {
      if (newValue) {
        this.handleInitWebViewInfo();
      }
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
      localStorage.removeItem('isSmallWindow');
      this.isSmallWindow = false;
      if (data?.isPIP) {
        // IOS下，需恢复web播放
        this.playerCtrl && this.playerCtrl.resume();
      }
    },

    handleResize() {
      setTimeout(() => {
        // 更新 swiper 宽高变化
        this.$refs.swiper && this.$refs.swiper.$swiper.update(true);
        console.info(this.$refs.swiper);
      }, 200);
    },

    // IOS 系统级小窗需要下列信息
    sendInitInfo() {
      const { channelId, userId } = this.channelDetail;
      const { watchInfo } = this.channelDetail;
      this.webviewBridge && this.webviewBridge.sendData('getLiveUserInfo', {
        userId,
        channelId,
        customParam: {
          liveParam1: watchInfo?.viewerInfo?.viewerId || 'guest', // 用户id,
          liveParam2: watchInfo?.viewerInfo?.nickname || 'guest',
          liveParam3: watchInfo?.viewerInfo?.param3 || '',
          liveParam4: watchInfo?.viewerInfo?.param4 || '',
          liveParam5: watchInfo?.viewerInfo?.param5 || '',
        }
      });
    },

    // 从小窗恢复常规窗口
    waitForRecover() {
      this.webviewBridge && this.webviewBridge.sendData('changeToNormal');
    },

    async handleInitWebViewInfo() {
      // 是否为 plvwebviewapp 环境
      if (isWebView()) {
        await initWebView();
        this.handleInitBindWebViewEvent();
        this.sendInitInfo();
        window.addEventListener('resize', this.handleResize);
        this.$once('hook:beforeDestroy', () => {
          this.handleRemoveWebViewEvent();
          window.removeEventListener('resize', this.handleResize);
        });
      }
    }
  },
};
