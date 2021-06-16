import { liveSdk } from './live-sdk';
import { imgSizeComputed, videoSizeComputed, pptVideoSizeComputed } from '../utils/player-utils';
import BaseStore from './base-store';
import PlayEvents from './player-evt';
import { setStyle } from '../utils/dom';

class PortraitPlayer extends BaseStore {
  constructor(options = {}) {
    super();
    this.portrait = options.portrait;
    this.liveStatus = options.liveStatus;
    this.streamType = options.streamType;
    this.resolutionWidth = options.resolutionWidth;
    this.resolutionHeight = options.resolutionHeight;
    this.videoSizeTimer = null;
    this.setVideoSize();
    this.setImgSize(this.warmupImgSelector);
    this.bindPlayerEvent();
    this.listenPlayerEvent();
    this.bindVideoEvent();
  }

  getEventHandle() {
    return {
      playing: () => this.trigger(PlayEvents.PLAYING),
      pause: () => this.trigger(PlayEvents.PAUSE),
      timeupdate: (currentTime) => {
        this.trigger(PlayEvents.TIME_UPDATE, {
          currentTime,
          duration: this.duration,
        });
      },
      ratechange: (rate) => this.trigger(PlayEvents.RATE_CHANGE, { rate }),
    };
  }

  bindVideoEvent() {
    if (this.playerVideo) {
      this.playerVideo.addEventListener('timeupdate', (currentTime) => {
        this.trigger(PlayEvents.TIME_UPDATE, {
          currentTime: liveSdk.player.currentTime,
          duration: this.duration,
        });
      });
    }
  }

  // 监听播放器事件，同步到内置事件中
  listenPlayerEvent() {
    const events = this.getEventHandle();
    for (const key in events) {
      liveSdk.player.on(key, events[key]);
    }
  }

  // 绑定内部事件
  bindPlayerEvent() {
    const actions = {
      [PlayEvents.PLAYING]: () => {
        this.refreshVideoSize();
      },
    };
    for (const event in actions) {
      this.on(event, actions[event].bind(this));
    }
  }

  // 读取video里面的尺寸并重新计算位置
  refreshVideoSize() {
    clearTimeout(this.videoSizeTimer);
    this.videoSizeTimer = null;
    this.videoSizeTimer = setTimeout(() => {
      const playerVideo = this.playerVideo;
      if (playerVideo) {
        const width = playerVideo.videoWidth;
        const height = playerVideo.videoHeight;
        const size = `${width}*${height}`;
        if (size === this.preVideoSize) { return; }

        if (width && height && size !== this.preVideoSize) {
          this.resolutionWidth = width;
          this.resolutionHeight = height;
          this.preVideoSize = size;
          this.setVideoSize();
          clearTimeout(this.videoSizeTimer);
          this.videoSizeTimer = null;
        } else {
          this.refreshVideoSize();
        }
      }
    }, 400);
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
    let size = null;
    if (this?.portrait?.isPPT && this?.portrait?.portraitState?.documentSwitch) {
      size = pptVideoSizeComputed(screenData, videoData);
    } else {
      size = videoSizeComputed(screenData, videoData);
    }
    const videoDom = document.querySelector('#player-container .plvideo') || document.querySelector('#player-container #plv_container');
    if (!size || !videoDom) return;
    for (const styleName in size) {
      setStyle(videoDom, styleName, `${size[styleName]}px`);
    }
  }

  seek(time) {
    liveSdk.player.seek(time);
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

  changeRate(rate) {
    liveSdk.player.setRate(rate);
    if (this.playerVideo) {
      this.playerVideo.playbackRate = rate;
    }
    this.trigger(PlayEvents.RATE_CHANGE, { rate });
  }

  getCurrentTime() {
    return liveSdk.player?.currentTime || 0;
  }

  // 等待正片播放
  waitForPositivePlay() {
    return new Promise((resolve) => {
      const handleTimeUpdate = function() {
        const currentTime = this.getCurrentTime();
        if (currentTime > 0) {
          resolve();
          this.off(PlayEvents.TIME_UPDATE, handleTimeUpdate);
        }
      };
      this.on(PlayEvents.TIME_UPDATE, handleTimeUpdate);
    });
  }

  get duration() {
    let duration = liveSdk.player.duration || liveSdk.player.config.duration;
    if (isNaN(duration)) {
      duration = 0;
    }
    return duration;
  }

  get playerVideo() {
    return document.querySelector('#player-container video');
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
