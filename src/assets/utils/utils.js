export const checkParams = (params, keys) => {
  for (let i = 0; i < keys.length; i++) {
    if (!params[keys[i]]) {
      throw new Error(`请传入${keys[i]}`);
    }
  }
};

/**
 * html字符串提取纯文本
 * @param {String} html html文本
 */
export const htmlStr2Text = (html) => {
  if (!html) return '';
  const dom = document.createElement('div');
  dom.innerHTML = html;
  return dom.textContent;
};

/**
 * 延迟
 * @param {Number} time 延迟时间
 */
export const delay = (time) => {
  return new Promise(resolve => setTimeout(resolve, time));
};

/**
 * 获取指定范围内的随机数：(min, max]
 * @param {Number} min 最小值
 * @param {Number} max 最大值
 * @param {Number} dot 精度，小数位
 */
export const getRandom = (min, max, dot = 0) => {
  const r = Math.random();
  let result = min + ((max - min) * r);
  if (dot > 0) {
    result = result.toFixed(dot);
  } else {
    result = Math.ceil(result);
  }
  return result;
};

// 秒数转时间字符串
export const formTimeSecond = (t) => {
  t = Math.floor(t) || 0;
  const hs = 60 * 60;
  const h = Math.floor(t / hs);
  const m = Math.floor((t % hs) / 60);
  const s = t - (h * hs) - (m * 60);
  const addZero = a => {
    if (!a || a === Infinity) { return '00'; }
    return String(a).length === 1 ? `0${a}` : a;
  };
  return `${addZero(h)}:${addZero(m)}:${addZero(s)}`;
};
