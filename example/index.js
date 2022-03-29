import PolyvPortraitWatch from '../src/index.js';
import VConsole from 'vconsole';

new PolyvPortraitWatch({
  el: document.getElementById('portrait-view'),
  appId: 'fj1yxfco1y',
  appSecret: '99f12aa8b6b5475cab45d4cbbf09e432',
  channelId: '1778938',
  user: {
    userId: '123456',
    userName: 'polyv-test',
  }
});

new VConsole();
