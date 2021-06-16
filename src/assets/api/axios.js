/**
 * @file axios请求封装
 * 在request拦截器进行签名操作
 */
import axios from 'axios';
import { stringify } from '@utils/querystring';
import { getSign } from '../utils/sign';
import { config as appConfig } from '../utils/config';

const instance = axios.create();

/**
 * 新增axios自定义参数：
 * @param {Boolean} ignoreSign 是否忽略签名
 * @param {Boolean} ignoreBaseUrl 是否忽略域名注入
 * @param {String} apiType 接口类型，normal为api.polyv.net，chat为apichat.polyv.net
 */
instance.interceptors.request.use(async (config) => {
  // console.info(config);
  let data = {};
  switch (config.method) {
    case 'get':
      data = config.params;
      break;
    case 'post':
      data = config.data;
      break;
    default:
      break;
  }
  if (!config.ignoreSign) {
    const signData = await getSign(data);

    data.appId = signData.appId;
    data.timestamp = signData.timestamp;
    data.sign = signData.sign;
  }

  let baseUrl = '';
  if (!config.ignoreBaseUrl) {
    const apiType = config.apiType || 'normal';
    baseUrl = apiType === 'chat' ? appConfig.chatBaseUrl : appConfig.baseUrl;
  }
  config.url = baseUrl + config.url;

  if (config.method === 'post') {
    config.data = stringify(config.data);
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

instance.interceptors.response.use((response) => {
  const { status, data } = response;
  if (status !== 200 || data.status === 'fail') {
    return Promise.reject(data);
  }
  return data;
}, (error) => {
  return Promise.reject(error);
});

export default instance;
