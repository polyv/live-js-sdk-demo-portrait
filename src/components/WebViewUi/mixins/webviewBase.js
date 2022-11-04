import { webviewBridge } from '../../../assets/utils/webview';

export default {
  data() {
    return {
      isSmallWindow: false, // 小窗口模式
    };
  },
  computed: {
    webviewBridge() {
      return webviewBridge;
    }
  }
};
