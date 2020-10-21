import axios from './axios';
import { config } from '../utils/config';

export default {
  // 获取打赏设置
  getDonateDetail() {
    return axios.get('/live/v3/channel/donate/get', {
      params: {
        channelId: config.channelId
      }
    });
  },
  // 发送打赏消息
  sendDonateMsg(params) {
    return axios.post('/live/v3/channel/chat/send-reward-msg', {
      channelId: config.channelId,
      nickname: config.user.userName,
      avatar: config.user.avatar || config.defaultAvatar,
      viewerId: config.user.userId,
      ...params
    });
  }
};
