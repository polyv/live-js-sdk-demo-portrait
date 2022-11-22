import { webviewBridge } from '../../../assets/utils/webview';
import { webviewStore } from '../../../assets/store/webview';
const pageSmallWindowClass = 'p-watch--small-window';

export default {
  data() {
    const isSmallWindow = JSON.parse(localStorage.getItem('isSmallWindow') || 'false');
    webviewStore.isSmallWindow = isSmallWindow;
    if (isSmallWindow) {
      document.body.classList.add(pageSmallWindowClass);
    }
    return {
      isSmallWindow, // 小窗口模式
    };
  },
  computed: {
    webviewBridge() {
      return webviewBridge;
    }
  }
};
