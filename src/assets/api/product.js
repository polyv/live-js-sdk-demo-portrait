import axios from './axios';
import { config } from '../utils/config';

export default {
  // 获取商品列表
  getProductList(params) {
    return axios.get('/live/v3/channel/product/getListByRank', {
      params: {
        channelId: config.channelId,
        ...params
      }
    });
  }
};
