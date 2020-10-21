import axios from './axios';
import { config } from '../utils/config';

export default {
  // 获取频道详情
  getChannelDetail() {
    return axios.get('/live/v3/applet/sdk/get-channel-token-detail', {
      params: {
        channelId: config.channelId
      }
    });
  }
};
