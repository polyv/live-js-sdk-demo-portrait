import md5 from 'jraiser/crypto/1.1/md5';

/**
 * 部分接口计算 sign 值
 * @param {Object} data 校验参数
 * @param {String} data.secret 签名密钥
 * @returns {String} 通过参数及密钥计算得到的 md5 值
 */
export function genSign(data, secret = 'polyvChatSign') {
  let text = '';
  const keys = Object.keys(data).sort();

  for (const key of keys) {
    text += `${key}${data[key]}`;
  }
  const sign = md5(secret + text + secret);
  return sign.toUpperCase();
}
/**
 * 把指定字符串中的 HTML 实体 替换成 HTML 预留字符。对应@utils/string的escape函数
 * @param {string} str 指定字符串。
 * @return {string} 替换后的字符串。
 */
export function unescapeHTML(str) {
  if (str == null) { return str; }
  const map = {
    '&quot;': '"',
    '&#39;': '\'',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>'
  };
  return String(str).replace(/(&quot;|&#39;|&amp;|&lt;|&gt;)/g, (match) => {
    return map[match];
  });
}
