<template>
  <div
    :style="playerWrapStyle"
    class="c-player"
    :class="{
      'c-player--living': liveStatus === 'live',
      'c-player--playbacking': isPlaybacking,
    }">
    <!-- 文档容器 -->
    <div
      v-if="isPPT"
      v-show="documentVisible"
      class="c-player__doc"
      id="doc-container"
      :style="docWrapStyle"></div>
    <!-- 播放器容器 -->
    <div
      id="player-container"
      :class="[
        'c-player__container',
        liveStatus === 'live' ? 'c-player__container--live' : '',
        playerInited ? '' : 'c-player__container--hide'
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
import channelBaseMixin from '../../assets/mixins/channel-base';
import { liveSdk } from '../../assets/live-sdk/live-sdk';
import NotLive from './not-live';
import AudioPanel from './audio-panel';
import VideoComputed from './video-computed';
import { config } from '../../assets/utils/config';

export default {
  mixins: [channelBaseMixin],

  components: {
    NotLive,
    AudioPanel,
    VideoComputed
  },

  methods: {
    createPlayer() {
      const playerOptions = {
        el: '#player-container',
        type: 'live',
        autoplay: true,
        controller: false,
        useH5Page: true,
        lowLatency: true,
      };
      if (this.isPPT) {
        playerOptions.pptEl = '#doc-container';
      }
      if (this.portrait.vid) {
        playerOptions.type = 'vod';
        playerOptions.vid = this.portrait.vid;
        if (config.vodType) {
          playerOptions.vodType = config.vodType;
        }
      }
      liveSdk.setupPlayer(playerOptions);
      this.$emit('player-init');
      // liveSdk.player.on('loadedmetadata', () => {
      //   console.log('initOver');
      //   this.$emit('player-init');
      // });
      // liveSdk.player.on('initOver', () => {
      //   console.log('initOver1');
      // });
      // window.s2j_onPlayerInitOver = () => {
      //   console.log('initOver2');
      // };
    }
  },

  computed: {
    playerWrapStyle() {
      const style = {};
      if (this.documentVisible) {
        style.paddingTop = `${this.docWrapHeight}px`;
      }
      return style;
    },
    docWrapStyle() {
      return {
        height: `${this.docWrapHeight}px`
      };
    }
  },

  watch: {
    docWrapHeight: {
      immediate: true,
      handler: function() {
        this.$nextTick(() => {
          if (liveSdk?.player?.player?.ppt?.resize) {
            liveSdk.player.player.ppt.resize();
          }
        });
      }
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
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9;
}
.c-player__container {
  width: 100%;
  height: 100%;
}
.plv-live-warmUp:nth-of-type(n+3) {
  display: none;
}
.plv-live-watermark + .plv-live-panel.plv-live-warmUp {
  display: block !important;
}
.c-player__container--hide {
  opacity: 0;
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

.c-player__doc {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}
</style>

<!-- 播放器内置样式覆盖 -->
<style>
/* 默认背景覆盖 */
.c-player__container,
.c-player__container .plwrap {
  background: url('./imgs/player-bg.png');
  background-size: cover;
}
.c-player__container .pv-ppt-layout {
  background-color: transparent;
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
.c-player__container #playbutton,
.c-player__container .plv-live-pause {
  display: none !important;
}
.c-player__container video {
  object-fit: cover !important;
  height: 100% !important;
}
.c-player__container .plv-live-cutOff {
  display: none;
}
/* 隐藏摄像头占位图 */
.c-player__container .pv-ppt-normal {
  background-image: none !important;
}
.c-player__container .error {
  position: absolute;
  top: 50%;
  left: 10px;
  right: 10px;
  transform: translateY(-50%);
  text-align: center;
  line-height: 30px;
}
.c-player--playbacking .plv-live-cover,
.c-player--living .plv-live-cover {
  display: none;
}
</style>
