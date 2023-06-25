import PolyvPortraitWatch from '../src/index.js';
import VConsole from 'vconsole';

const params = (new URL(document.location)).searchParams;

new PolyvPortraitWatch({
  el: document.getElementById('portrait-view'),
  appId: params.get('appId'),
  appSecret: params.get('appSecret'),
  channelId: params.get('channelId'),
  user: {
    userId: params.get('userId'),
    userName: params.get('userName'),
  }
});

new VConsole();
