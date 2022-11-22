import { WebViewBridge } from '@polyv/web-view-bridge';

export let webviewBridge;

export async function initWebView() {
  if (webviewBridge) { return; }
  webviewBridge = new WebViewBridge({
    // 接收事件时，是否自动进行 `JSON.parse` 格式化
    autoJsonParseByReceive: true
  });
  try {
    await webviewBridge.connectWebViewBridge();
  } catch (e) {
    console.error('桥接器连接失败');
  }
}
