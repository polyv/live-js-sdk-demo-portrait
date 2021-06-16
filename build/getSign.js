const md5 = require('md5');

// 请输入您的appSecret
const appSecret = 'YOU APP SECRET';

function resortParam(params) {
  // 除sign外字母顺序排列的key
  const arr = Object.keys(params).filter((item) => item !== 'sign').sort();
  let query = '';
  arr.forEach((item) => {
    query += `${item}${params[item]}`;
  });
  return query;
}

function getSignStr(params, prefix) {
  let keyString = resortParam(params);
  keyString = `${prefix}${keyString}${prefix}`;
  return md5(keyString).toUpperCase();
}

module.exports = function(query) {
  const sign = query.sign;
  const verifyUrlSign = getSignStr(query, 'plvPortraitApp');
  if (sign !== verifyUrlSign) {
    return {
      code: -1,
      message: 'invalid sign',
      status: 'error'
    };
  }

  return {
    code: 200,
    message: '成功',
    status: 'success',
    data: {
      sign: getSignStr(query, appSecret)
    }
  };
};
