<template>
  <div class="c-player">
    <!-- 播放器容器 -->
    <div
      id="player-container"
      :class="[
        'c-player__container',
        liveStatus === 'live' ? 'c-player__container--live' : ''
      ]"></div>
    <!-- 暂无直播占位 -->
    <not-live v-if="notLiveVisible" />
    <!-- 音频直播占位 -->
    <audio-panel
      v-if="audioVisible"
      :playerStatus="playerStatus" />
    <!-- 播放按钮 -->
    <img
      v-if="playerButtonVisible"
      class="c-player__button"
      src="./imgs/button-play.png" />
    <!-- 视频区域计算 -->
    <video-computed />
  </div>
</template>

<script>
import playerCommonMixin from '../../assets/mixins/player-common';
import { liveSdk } from '../../assets/live-sdk/live-sdk';
import NotLive from './not-live';
import AudioPanel from './audio-panel';
import VideoComputed from './video-computed';

export default {
  mixins: [playerCommonMixin],

  components: {
    NotLive,
    AudioPanel,
    VideoComputed
  },

  methods: {
    createPlayer() {
      liveSdk.setupPlayer({
        el: '#player-container',
        type: 'live',
        autoplay: true,
        controller: false,
        useH5Page: true,
      });
      liveSdk.player.on('initOver', () => {
        this.$emit('player-init');
      });
    }
  },

  mounted() {
    this.createPlayer();
  }
};
</script>

<style>
.c-player {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 9;
}
.c-player__container {
  width: 100%;
  height: 100%;
}
.c-player__button {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80px;
  height: 80px;
  margin-top: -40px;
  margin-left: -40px;
  z-index: 11;
}
.c-player__wrap {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('./imgs/player-bg.png');
  background-size: cover;
  z-index: 10;
  display: flex;
  flex-direction: column;
}
.c-player__wrap::before {
  height: 51px;
  content: '';
}
.c-player__wrap::after {
  height: 218px;
  content: '';
}
.c-player__wrap__content {
  flex: 1;
  position: relative;
}
.c-player__wrap__content__section {
  width: 100%;
  height: 211px;
  background: #00021A;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-size: 14px;
  color: #fff;
}
</style>

<!-- 播放器内置样式覆盖 -->
<style>
/* 默认背景覆盖 */
.c-player__container .plwrap {
  background: url('./imgs/player-bg.png');
  background-size: cover;
}
/* 隐藏直播播放器自带暂停按钮 */
.c-player__container .plv-live-cover__btn {
  opacity: 0 !important;
}
/* 片头广告覆盖全屏 */
.c-player__container .plv-live-ad__img {
  width: 100%;
  object-fit: cover;
}
/* 暖场图片覆盖 */
.c-player__container .plv-cover-box {
  background-size: cover !important;
  background-position: center center !important;
}
/* 直播暂停隐藏 */
.c-player__container .plv-live-pause {
  display: none;
}
.c-player__container video {
  object-fit: cover !important;
}
.c-player__container .plv-live-cutOff {
  display: none;
}
</style>
