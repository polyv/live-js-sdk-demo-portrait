import PolyvPortraitWatch from '../src/index.js';
import VConsole from 'vconsole';

new PolyvPortraitWatch({
  el: document.getElementById('portrait-view'),
  appId: 'APP_ID',
  appSecret: 'APP_SECRET',
  channelId: 'CHANNEL_ID',
  user: {
    userId: '123456',
    userName: 'polyv-test',
  }
});

new VConsole();
