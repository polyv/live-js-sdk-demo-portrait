import axios from './axios';
import { config } from '../utils/config';

export default {
  // 发送点赞
  sendLikes(times) {
    return axios.post(`/live/v2/channels/${config.channelId}/like`, {
      times,
      viewerId: config.user.userId,
    });
  }
};
