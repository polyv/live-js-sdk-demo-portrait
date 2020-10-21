/**
 * 本模块提供浏览器检测相关方法。
 * @module browser
 */

export { isMobile, isWeixin } from '@utils/browser';

/**
 * 获取微信版本
 * @return {string} 微信版本
 */
export function getWeixinVersion() {
  const regData = navigator.userAgent.match(/MicroMessenger\/([\d.]+)/i);
  return regData && regData.length ? regData[1] : '';
}

/**
 * 比较两个版本号，version1高于version2返回大于0
 * @param {String} version1
 * @param {String} version2
 */
export function compareVersions(version1, version2) {
  const reg = /(\.0+)+$/;
  const segA = version1.replace(reg, '').split('.');
  const segB = version2.replace(reg, '').split('.');
  const len = Math.min(segA.length, segB.length);
  for (let i = 0; i < len; i++) {
    const diff = parseInt(segA[i], 10) - parseInt(segB[i], 10);
    if (diff) {
      return diff;
    }
  }
  return segA.length - segB.length;
}
