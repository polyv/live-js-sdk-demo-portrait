import PolyvPortraitWatch from '../src/index.js';

new PolyvPortraitWatch({
  el: document.getElementById('portrait-view'),
  appId: 'YOU APPID',
  appSecret: 'YOU APP_SECRET',
  channelId: 'YOU CHANNELID',
  user: {
    userId: '123456',
    userName: 'polyv-test',
  }
});
