/**
 * @file 获取签名，主要负责根据verifyUrl/appSecret获取签名
 */

import { config } from './config';
import axios from '../api/axios';
import { PolyvLiveSdk } from '../live-sdk/live-sdk';

function resortParam(params) {
  // 除sign外字母顺序排列的key
  const arr = Object.keys(params).filter((item) => item !== 'sign').sort();
  let query = '';
  arr.forEach((item) => {
    query += `${item}${params[item]}`;
  });
  return query;
}

function getSignStrBySecret(params) {
  const appSecret = config.appSecret;
  let keyString = resortParam(params);
  keyString = `${appSecret}${keyString}${appSecret}`;
  return PolyvLiveSdk.md5(keyString).toUpperCase();
}

function getSignStrByVerifyUrl(params) {
  let keyString = resortParam(params);
  keyString = `plvPortraitApp${keyString}plvPortraitApp`;
  return PolyvLiveSdk.md5(keyString).toUpperCase();
}

export async function getSign(sendData) {
  const timestamp = Date.now();
  const appId = config.appId;

  const params = Object.assign({
    appId,
    timestamp
  }, sendData);

  if (config.verifyUrl) {
    const res = await axios.get(config.verifyUrl, {
      params: {
        ...params,
        sign: getSignStrByVerifyUrl(params)
      },
      ignoreSign: true,
      ignoreBaseUrl: true
    });
    if (res.code !== 200) {
      throw new Error(res);
    }
    return {
      appId,
      timestamp,
      sign: res.data.sign
    };
  }

  return {
    appId,
    timestamp,
    sign: getSignStrBySecret(params)
  };
}
