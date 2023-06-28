import Vue from 'vue';
import { checkDomClick } from '../../assets/utils/player-utils';
import { bus, PLAYER_CLICK, UPDATE_PLAYER_STATE } from '../../assets/utils/event-bus';
import PortraitPlayer from '../../assets/live-sdk/portrait-control';
import channelApi from '../../assets/api/channel';
import { liveSdk } from '../../assets/live-sdk/live-sdk';
import { config } from '../../assets/utils/config';

// 播放器默认数据
const defaultState = {
  liveStatus: '', // 直播状态, live-直播中, end-无直播
  streamType: 'client', // 推流方式
  playerStatus: 'stoped', // 视频是否正在播放，playing表示正在播放，stoped表示暂停, ended表示结束
  playerMode: 'video', // 播放器播放模式，video表示视频，audio表示音频
  isPlayed: false, // 是否已播放过视频
  // ----- 清晰度 ----- //
  multirateEnabled: 'N', // 多码率开关
  definitions: [], // 多码率列表
  currentDefinition: 0, // 当前的码率
  // ----- 倍速 ----- //
  currentRate: 1, // 当前倍速
  // ----- 其他 ----- //
  warmupType: '', // 暖场类型，img: 暖场图片，video: 暖场视频
  logoHref: '', // logo跳转连接
  warmupImgClickUrl: '', // 暖场为图片时点击的跳转连接
  advertHref: '', // 片头广告跳转连接
};

export default {
  data() {
    return {
      playerState: {
        ...defaultState
      },
      vid: null,
      // 点击次数
      clickCount: 0,
      clickTimer: null,
      playerCtrl: null,
    };
  },

  watch: {
    documentVisible: {
      handler(visible) {
        if (visible) {
          this.$nextTick(() => {
            if (liveSdk?.player?.player?.ppt?.resize) {
              liveSdk.player.player.ppt.resize();
            }
          });
        }
        Vue.nextTick(() => {
          this.playerCtrl && this.playerCtrl.setVideoSize();
        });
      }
    }
  },

  methods: {
    async handlePlayerInit() {
      // 连麦实例初始化完成，可以进行连麦相关代码调用，无延迟，普通直播并支持连麦的情况下会回调
      liveSdk.player.on('rtcInitialized', (rtc) => {
        // 也可以这样获取实例 liveSdk.player.rtcInstance
        console.info('连麦sdk实例', rtc);
        // 连麦sdk加载后调用相关代码
        this.rtcInstance = rtc;
        this.initRtcEvents();
      });
      // 重新获取流信息
      const { data: detailData } = await channelApi.getChannelDetail();

      this.playerState = {
        ...defaultState
      };

      // 码率信息
      const levels = liveSdk.player.levels;
      this.playerState.multirateEnabled = levels ? 'Y' : 'N';
      if (liveSdk.player.levels) {
        const levelData = ['流畅', '高清', '超清'];
        this.playerState.definitions = levelData.filter((item, index) => index < liveSdk.player.levels);
        this.playerState.definitions = this.playerState.definitions.map((item, index) => ({ name: item, value: index }));
        this.playerState.currentDefinition = liveSdk.player.level;
      }

      // 暖场信息
      let warmupType = '';
      if (this.ynToBool(detailData.warmUpEnabled)) {
        let warmupImgClickUrl = '';
        if (detailData.warmUpType === 'warmImage') {
          warmupType = 'img';
          warmupImgClickUrl = detailData.imageClickUrl;
        } else if (detailData.warmUpType === 'warmVideo') {
          warmupType = 'video';
        }
        this.playerState.warmupType = warmupType;
        this.playerState.warmupImgClickUrl = warmupImgClickUrl;
      }

      // logo信息
      this.playerState.logoHref = detailData.playerLogoHref;
      // 片头广告
      const advertHref = detailData.advertHref;
      this.playerState.advertHref = advertHref;
      // 直播状态
      this.playerState.liveStatus = this.channelDetail.watchStatus === 'live' ? 'live' : 'end';
      // 推流类型
      this.playerState.streamType = detailData.streamType;

      this.playerCtrl = new PortraitPlayer({
        portrait: this,
        liveStatus: this.channelDetail.watchStatus,
        streamType: detailData.streamType,
        resolutionWidth: detailData.resolutionWidth,
        resolutionHeight: detailData.resolutionHeight
      });
      if (liveSdk?.player?.player?.ppt) {
        this.portraitState.documentProportion = liveSdk.player.player.ppt.prop;
        liveSdk.player.player.ppt.on('propChange', (prop) => {
          this.$set(this.portraitState, 'documentProportion', prop);
        });
      }
    },

    openUrl(url) {
      if (url) {
        window.open(url, '_blank', 'noopenner=true');
      }
    },

    handlePlayerClick(event) {
      // 正在显示暂无直播，忽略不处理
      const notLiveDom = document.querySelector('[data-not-live]');
      if (notLiveDom) { return; }

      // 正在显示广告
      const advertDom = document.querySelector('.plv-live-ad__img');
      if (advertDom && checkDomClick(advertDom, event)) {
        this.openUrl(this.playerState.advertHref);
        return;
      }

      // 判断logo点击
      const logoDom = document.querySelector('.plv-live-logo');
      if (logoDom && checkDomClick(logoDom, event)) {
        this.openUrl(this.playerState.logoHref);
        return;
      }

      // 正在显示暖场图片
      const warmImgDom = document.querySelector('.plv-live-warmUp .plv-cover-box');
      if (warmImgDom && checkDomClick(warmImgDom, event)) {
        this.openUrl(this.playerState.warmupImgClickUrl);
        return;
      }

      const adverDom = document.querySelector('.plv-live-ad');
      if (adverDom) { return; }

      this.clickCount++;
      this.clickTimer && clearTimeout(this.clickTimer);
      this.clickTimer = setTimeout(() => {
        if (this.playerState.playerStatus === 'stoped') {
          this.playerCtrl.resume();
        } else if (this.clickCount >= 2) {
          this.playerCtrl.pause();
        }
        this.clickCount = 0;
        this.clickTimer = null;
      }, 200);
    },

    handlePlayerStateChange(key, value) {
      this.$set(this.playerState, key, value);
    }
  },

  mounted() {
    this.vid = config.vid;
    bus.$on(PLAYER_CLICK, this.handlePlayerClick);
    bus.$on(UPDATE_PLAYER_STATE, this.handlePlayerStateChange);
  },

  beforeDestroy() {
    clearTimeout(this.clickTimer);
    this.clickTimer = null;
    bus.$off(PLAYER_CLICK, this.handlePlayerClick);
    bus.$off(UPDATE_PLAYER_STATE, this.handlePlayerStateChange);
  }
};
