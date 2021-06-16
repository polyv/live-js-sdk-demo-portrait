import axios from './axios';
import { config } from '../utils/config';

export default {
  // 发送点赞
  // api文档：https://dev.polyv.net/2018/liveproduct/l-api/zbhd/like/
  sendLikes(times) {
    return axios.post(`/live/v2/channels/${config.channelId}/like`, {
      times,
      viewerId: config.user.userId,
    });
  }
};
