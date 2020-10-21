/**
 * 判断是否点击dom区域
 * @param {Element} dom 节点
 * @param {Event} event 原生事件
 */
export const checkDomClick = (dom, event) => {
  if (!dom || !event) return;
  const clickX = event.x;
  const clickY = event.y;

  const startX = dom.offsetLeft;
  const endX = startX + dom.offsetWidth;
  const startY = dom.offsetTop;
  const endY = startY + dom.offsetHeight;

  return (clickX >= startX && clickX <= endX) &&
    (clickY >= startY && clickY <= endY);
};

/**
 * 根据sh获取视频区域尺寸
 * @param {Number} sh 屏幕高度
 */
export const getVideoAreaData = (sh) => {
  const topAreaDom = document.querySelector('[data-video-computed-top]');
  const bottomAreaDom = document.querySelector('[data-video-computed-bottom]');
  // 上下阻挡区域
  const topStopHeight = topAreaDom.clientHeight;
  const bottomStopHeight = bottomAreaDom.clientHeight;
  // 视频区域高度
  const videoAreaHeight = sh - topStopHeight - bottomStopHeight;
  return {
    topStopHeight,
    bottomStopHeight,
    videoAreaHeight
  };
};

/**
 * video标签尺寸位置计算
 * @param {Object} screenData 屏幕尺寸
 * @param {Object} videoData 视频流尺寸
 */
export const videoSizeComputed = (screenData, videoData) => {
  const { sw = 0, sh = 0 } = screenData;
  const { vw = 0, vh = 0 } = videoData;
  if (!sw || !sh || !vw || !vh) return null;

  let sizeData = {
    width: '',
    height: '',
    top: '',
    left: ''
  };

  const { topStopHeight, videoAreaHeight } = getVideoAreaData(sh);
  // 视频宽度占满的等比高度
  const _vh = (vh / vw) * sw;
  // 视频高度占满的等比宽度
  const _vw = (vw / vh) * sh;

  // 等比高度超出屏幕高度，宽度占满，上下裁边
  if (_vh >= sh) {
    sizeData = {
      width: sw,
      height: _vh,
      top: (sh - _vh) / 2,
      left: 0
    };
    return sizeData;
  }

  // 等比高度小于视频区域高度，宽度占满，视频区域内上下居中
  if (_vh <= videoAreaHeight) {
    sizeData = {
      width: sw,
      height: _vh,
      top: ((videoAreaHeight - _vh) / 2) + topStopHeight,
      left: 0
    };
    return sizeData;
  }

  // 高度占满，左右裁边
  sizeData = {
    width: _vw,
    height: sh,
    top: 0,
    left: (sw - _vw) / 2
  };

  return sizeData;
};

export const imgSizeComputed = (screenData) => {
  const { sw = 0, sh = 0 } = screenData;
  if (!sw || !sh) return null;

  const { topStopHeight, videoAreaHeight } = getVideoAreaData(sh);
  const ih = (9 / 16) * sw;
  const top = ((videoAreaHeight - ih) / 2) + topStopHeight;
  return {
    width: sw,
    height: ih,
    top,
    left: 0
  };
};
