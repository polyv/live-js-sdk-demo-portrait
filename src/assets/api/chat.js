import axios from './axios';
import { config } from '../utils/config';

export default {
  // 获取历史聊天消息记录列表
  getChatHistory(params) {
    return axios.get('/front/history', {
      params: {
        roomId: config.channelId,
        hide: 0,
        fullMessage: 1,
        ...params
      },
      apiType: 'chat',
      ignoreSign: true
    });
  }
};
