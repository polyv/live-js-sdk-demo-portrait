import { getScript } from 'jraiser/ajax/1.5/ajax';
import { config } from '../utils/config';
import { getSign } from '../utils/sign';

const sdkUrl = 'https://player.polyv.net/livesdk/polyv-live.min.js';

// 可能存在重复加载 sdk 的情况，把加载 sdk 的 promise 记录下来
let loaderPromise = null;

export let PolyvLiveSdk;
export let liveSdk = null;

// 加载sdk文件
export function loadLiveSdk() {
  if (!loaderPromise) {
    loaderPromise = getScript(sdkUrl).then(() => {
      PolyvLiveSdk = window.PolyvLiveSdk;
      PolyvLiveSdk.EVENTS.PRODUCT_MESSAGE = 'PRODUCT_MESSAGE';
      return PolyvLiveSdk;
    });
  }
  return loaderPromise;
}

// 实例化sdk
export async function createLiveSdk() {
  await loadLiveSdk();
  const channelId = config.channelId;
  const signData = await getSign({ channelId });
  destroyLiveSdk();
  liveSdk = new PolyvLiveSdk({
    channelId,
    user: config.user,
    ...signData
  });
  liveSdk.on(PolyvLiveSdk.EVENTS.CHANNEL_DATA_INIT, () => {
    liveSdk.socket.on('message', (msg) => {
      let data;
      try {
        data = JSON.parse(msg);
      } catch (e) {
        console.error('Invalid message: ' + e.message);
      }
      if (!data) { return; }
      const { EVENT } = data;
      if (EVENT === 'PRODUCT_MESSAGE') {
        liveSdk.trigger(PolyvLiveSdk.EVENTS.PRODUCT_MESSAGE, data);
      }
    });
  });
}

export function destroyLiveSdk() {
  if (liveSdk instanceof PolyvLiveSdk) {
    liveSdk.destroy();
    liveSdk = null;
  }
}
