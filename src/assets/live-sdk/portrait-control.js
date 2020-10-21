import { liveSdk } from './live-sdk';
import { imgSizeComputed, videoSizeComputed } from '../utils/player-utils';
import BaseStore from './base-store';
import PlayEvents from './player-evt';
import { setStyle } from '../utils/dom';

class PortraitPlayer extends BaseStore {
  constructor(options = {}) {
    super();
    this.liveStatus = options.liveStatus;
    this.streamType = options.streamType;
    this.resolutionWidth = options.resolutionWidth;
    this.resolutionHeight = options.resolutionHeight;
    this.setImgSize(this.warmupImgSelector);
    // 设置video位置
    if (this.streamType === 'client' && this.liveStatus === 'live') {
      this.setVideoSize();
    }
  }

  /**
   * 设置暖场&片头图片位置
   * @param {Object} selector
   */
  setImgSize(selector) {
    const screenData = this.screenData;
    const size = imgSizeComputed(screenData);
    const imgDom = document.querySelector(selector);
    if (!size || !imgDom) return;
    setStyle(imgDom, 'position', 'absolute');
    setStyle(imgDom, 'bottom', 'initial');
    for (const styleName in size) {
      setStyle(imgDom, styleName, `${size[styleName]}px`);
    }
  }

  // 设置video标签位置
  setVideoSize() {
    const screenData = this.screenData;
    const videoData = {
      vw: this.resolutionWidth,
      vh: this.resolutionHeight
    };
    const size = videoSizeComputed(screenData, videoData);
    const videoDom = document.querySelector('#player-container .plvideo');
    if (!size || !videoDom) return;
    for (const styleName in size) {
      setStyle(videoDom, styleName, `${size[styleName]}px`);
    }
  }

  resume() {
    const playButton = document.querySelector('.plv-live-cover__btn');
    if (playButton && playButton.click) {
      playButton.click();
    }

    if (liveSdk.player) {
      liveSdk.player.play();
    }
    this.trigger(PlayEvents.PLAYING);
  }

  pause() {
    liveSdk.player.pause();
    this.trigger(PlayEvents.PAUSE);
  }

  setPlayerMode(mode) {
    this.trigger(PlayEvents.MODE_CHANGE, { mode });
  }

  changeDefinition(definition) {
    liveSdk.player.switchLevel(definition);
    this.trigger(PlayEvents.LEVEL_CHANGE, { definition });
    this.trigger(PlayEvents.PLAYING);
  }

  // 是否正在显示片头广告图片&视频
  get isShowAdvert() {
    const adverDom = document.querySelector('.plv-live-ad');
    return !!adverDom;
  }

  // 暖场图片dom选择器
  get warmupImgSelector() {
    return '.c-player__container .plv-cover-box';
  }

  // 广告图片dom选择器
  get advertImgSelector() {
    return '.c-player__container .plv-live-ad__img';
  }

  // 获取屏幕尺寸
  get screenData() {
    return {
      sw: document.documentElement.clientWidth,
      sh: document.documentElement.clientHeight
    };
  }
}

export default PortraitPlayer;
