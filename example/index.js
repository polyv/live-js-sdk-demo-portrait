import PolyvPortraitWatch from '../src/index.js';
import VConsole from 'vconsole';

new PolyvPortraitWatch({
  el: document.getElementById('portrait-view'),
  appId: 'g1zd4otbpz',
  appSecret: '9a2912c80afa49b6b7a0fb94184940ef',
  channelId: '4057466',
  user: {
    userId: '123456',
    userName: 'polyv-test',
  }
});

new VConsole();
