import axios from './axios';
import { config } from '../utils/config';
import { getSign } from '../utils/sign';

export default {
  // 获取频道详情
  getChannelDetail() {
    return axios.get('/live/v3/applet/sdk/get-channel-token-detail', {
      params: {
        channelId: config.channelId
      }
    });
  },

  async getChannelToken() {
    const channelId = config.channelId;
    const signData = await getSign({
      channelId,
      viewerId: config.user.userId,
    });
    return axios.post('/live/v3/channel/watch/get-api-token', signData);
  }
};
