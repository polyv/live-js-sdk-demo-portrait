import PolyvPortraitWatch from '../src/index.js';
import VConsole from 'vconsole';

new PolyvPortraitWatch({
  el: document.getElementById('portrait-view'),
  appId: '',
  appSecret: '',
  channelId: '4057466',
  user: {
    userId: '123456',
    userName: 'polyv-test',
  }
});

new VConsole();
