import axios from './axios';
import { config } from '../utils/config';

export default {
  // 获取打赏设置
  // api文档：https://dev.polyv.net/2018/liveproduct/l-api/szgkygg/ymhd/donate-get/
  getDonateDetail() {
    return axios.get('/live/v3/channel/donate/get', {
      params: {
        channelId: config.channelId
      }
    });
  },
  // 发送打赏消息
  // api文档：https://dev.polyv.net/2019/liveproduct/l-api/zbhd/fsdsxx/
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
