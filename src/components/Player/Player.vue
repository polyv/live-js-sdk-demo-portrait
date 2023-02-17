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
      v-if="playerButtonVisible && !isSmallWindow"
      class="c-player__button"
      src="./imgs/button-play.png" />
    <!-- 视频区域计算 -->
    <video-computed />
    <!-- 小窗口UI -->
    <web-view-ui
      v-show="isSmallWindow"
      :player-button-visible="playerButtonVisible"
      @clickMain="playerClick"
    />
  </div>
</template>

<script>
import channelBaseMixin from '../../assets/mixins/channel-base';
import { liveSdk } from '../../assets/live-sdk/live-sdk';
import PlayEvents from '../../assets/live-sdk/player-evt';
import NotLive from './not-live';
import AudioPanel from './audio-panel';
import WebViewUi from '../../components/WebViewUi';
import VideoComputed from './video-computed';
import { config } from '../../assets/utils/config';
import { bus, UPDATE_PLAYER_STATE, PLAYER_CLICK } from '../../assets/utils/event-bus';
import { webviewStore } from '../../assets/store/webview';

export default {
  mixins: [channelBaseMixin],

  components: {
    NotLive,
    AudioPanel,
    VideoComputed,
    WebViewUi,
  },
  props: {
    isSmallWindow: Boolean,
    clientWidth: Number
  },

  methods: {
    createPlayer() {
      let playerOptions = {
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
      if (this.isPlaybacking) {
        playerOptions = Object.assign(playerOptions, this.getLivePlaybackOptions());
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
    },

    /**
     * 获取回放配置
     */
    getLivePlaybackOptions() {
      let playbackOptions = {};

      // 指定视频播放
      if (this.isAppointVideo) {
        playbackOptions.type = 'vod';
        playbackOptions.vid = this.portrait.vid;
        if (config.vodType) {
          playbackOptions.vodType = config.vodType;
        }
      } else if (this.channel.recordFileSimpleModel) {
        // 最新暂存播放
        const { fileId, m3u8, mp4, originSessionId } = this.channel.recordFileSimpleModel;
        playbackOptions = {
          type: 'record',
          pptType: 'record',
          fileId: fileId,
          url: m3u8 || mp4,
          sessionId: originSessionId
        };
      } else if (this.channel.playbackSingleVideo) {
        // 指定单个回放视频
        const { videoPoolId } = this.channel.playbackSingleVideo;
        playbackOptions = {
          type: 'vod',
          vid: videoPoolId
        };
      }
      this.portrait.portraitState.currentPlaying = playbackOptions;
      return playbackOptions;
    },

    afterPlayOver(key, val) {
      // const currentPlaying = this.portrait.portraitState.currentPlaying;
      if (val === PlayEvents.ENDED) {
        //  单视频回放，重新开始播放
        const playerCtx = this.getPlayerCtrl();
        setTimeout(() => playerCtx.seek(0), 1000);
      }
      // TODO 回放列表
    },
    playerClick(e) {
      if (this.isSmallWindow && !this.playerButtonVisible) {
        // 点击 webview 小窗，播放中，恢复全屏
        webviewStore.isSmallWindow = false;
        this.$emit('handleChangeToNormal');
      }
      bus.$emit(PLAYER_CLICK, e);
    },
  },

  computed: {
    playerWrapStyle() {
      const style = {};
      if (this.documentVisible && !this.isSmallWindow) {
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
    },

    playerInited: {
      immediate: true,
      handler: function(val) {
        if (val) {
          bus.$on(UPDATE_PLAYER_STATE, this.afterPlayOver);
        }
      }
    },
    liveStatus: {
      immediate: false,
      handler: function(status, oldStatus) {
        if (oldStatus && status) {
          if (status === 'live') location.reload();
          const playbackOptions = this.getLivePlaybackOptions();
          // 判断有回放设置时, 刷新页面
          if (playbackOptions?.type) {
            location.reload();
          }
        }
      }
    }
  },
  mounted() {
    this.createPlayer();
  },
  beforeDestroy() {
    bus.$off(UPDATE_PLAYER_STATE, this.afterPlayOver);
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
