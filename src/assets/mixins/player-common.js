export default {
  inject: ['portrait'],

  props: {
    channel: Object
  },

  computed: {
    playerData() {
      return this.playerState || this.portrait?.playerState || {};
    },

    playerCtrl() {
      return this.portrait?.playerCtrl || {};
    },

    liveStatus() { return this.playerData?.liveStatus; },
    playerMode() { return this.playerData?.playerMode; },
    lines() { return this.playerData?.lines; },
    currentLine() { return this.playerData?.currentLine; },
    warmupType() { return this.playerData?.warmupType; },
    multirateEnabled() { return this.playerData?.multirateEnabled; },
    definitions() { return this.playerData?.definitions; },
    currentDefinition() { return this.playerData?.currentDefinition; },
    playerStatus() { return this.playerData?.playerStatus; },
    streamType() { return this.playerData?.streamType; },

    /**
     * 是否有音视频状态(或)
     * 1. 有直播
     * 2. 没直播但有暖场视频
     */
    hasVideo() {
      const rule1 = this.liveStatus === 'live';
      const rule2 = this.liveStatus !== 'live' && this.warmupType === 'video';
      return rule1 || rule2;
    },

    /**
     * 播放按钮是否显示
     * 1. 播放状态为暂停
     * 2. 暂无直播没显示
     * 3. 有视频显示中
     */
    playerButtonVisible() {
      const rule1 = this.playerStatus === 'stoped';
      const rule2 = !this.notLiveVisible;
      const rule3 = this.hasVideo;
      return rule1 && rule2 && rule3;
    },

    /**
     * 是否显示暂无直播
     * 1. 当前没直播
     * 2. 没设置暖场内容
     */
    notLiveVisible() {
      return this.liveStatus !== 'live' && this.warmupType === '';
    },

    /**
     * 是否正在音频直播中
     * 1. 推流方式为音频模式
     * 2. 推流状态为正在推流
     */
    isAudioLiving() {
      return this.liveStatus === 'live' && this.streamType === 'audio';
    },

    /**
     * 是否显示音频播放(或)
     * 1. 正在音频直播
     * 2. 播放模式为音频模式
     */
    audioVisible() {
      const rule1 = this.isAudioLiving;
      const rule2 = this.playerMode === 'audio';
      return rule1 || rule2;
    },

    /**
     * 是否显示音视频切换按钮
     * 1. 正在直播
     * 2. 当前正在音频直播中，不能切换到视频播放
     */
    setPlayModeVisible() {
      const rule1 = this.liveStatus === 'live';
      const rule2 = !this.isAudioLiving;
      return rule1 && rule2;
    },

    /**
     * 是否显示清晰度切换
     * 1. 多码率开关开启
     * 2. 多码率列表不为空
     * 3. 正在直播
     */
    setMultirateVisible() {
      const rule1 = this.ynToBool(this.multirateEnabled);
      const rule2 = this.definitions.length;
      const rule3 = this.liveStatus === 'live';
      return rule1 && rule2 && rule3;
    },

    /**
     * 播放器菜单栏是否显示(或)
     * 1. 可以设置音视频切换
     * 2. 可以设置多码率
     */
    playerMenuBarVisible() {
      return this.setPlayModeVisible || this.setMultirateVisible;
    }
  },

  methods: {}
};
