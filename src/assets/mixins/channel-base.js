import { isIOS } from '@utils/browser';

export default {
  inject: {
    portrait: {
      default: ''
    }
  },

  props: {
    channel: Object
  },

  computed: {
    channelData() {
      return this.channel || this.channelDetail;
    },

    playerData() {
      return this.playerState || this.portrait?.playerState || {};
    },

    portraitData() {
      return this.portraitState || this.portrait.portraitState || {};
    },

    documentSwitch() {
      return this.portraitData.documentSwitch;
    },
    documentProportion() {
      return this.portraitData.documentProportion;
    },

    channelScene() {
      return this.channelData?.scene;
    },

    isPPT() {
      return this.channelScene === 'ppt';
    },

    /**
     * 是否显示PPT文档
     * 1. 三分屏频道
     * 2. 正在直播 || 回放中
     * 3. 文档开关已打开
     */
    documentVisible() {
      const rule1 = this.isPPT;
      const rule2 = this.isLiveing || this.isPlaybacking;
      const rule3 = this.documentSwitch;
      return rule1 && rule2 && rule3;
    },

    /**
     * 是否显示显示/隐藏文档开关
     * 1. 三分屏频道
     * 2. 正在直播 || 回放中
     */
    documentSwitchVisible() {
      const rule1 = this.isPPT;
      const rule2 = this.isLiveing || this.isPlaybacking;
      return rule1 && rule2;
    },

    /**
     * 文档容器高度
     */
    docWrapHeight() {
      const clientWidth = document.documentElement.clientWidth;
      // 最小高度为9:16
      const minHeight = clientWidth * (9 / 16);
      // 最大高度为3:4
      const maxHeight = clientWidth * 0.75;
      // 文档不可见，高度设为0
      if (!this.documentVisible) { return 0; }
      if (!this.documentProportion) { return minHeight; }
      const height = clientWidth / this.documentProportion;
      if (height >= maxHeight) { return maxHeight; }
      if (height < minHeight) { return minHeight; }
      return height;
    },

    portraitHeight() {
      return this?.portrait?.clientHeight || 0;
    },

    /**
     * 频道信息位置
     * 0 - 公告介绍屏
     * 1 - 聊天室屏
     * --------------
     * 第0屏：
     * 1. 三分屏频道
     * 2. 正在直播 || 回放中
     */
    channelInfoSeat() {
      const rule1 = this.isPPT;
      const rule2 = this.isLiveing || this.isPlaybacking;
      return (rule1 && rule2) ? 0 : 1;
    },

    // 是否正在直播中
    isLiveing() {
      return this.liveStatus === 'live';
    },

    onlineUserNumber() {
      return this?.portraitData?.onlineUserNumber || 0;
    },

    liveStatus() { return this.playerData?.liveStatus; },
    playerMode() { return this.playerData?.playerMode; },
    lines() { return this.playerData?.lines; },
    currentLine() { return this.playerData?.currentLine; },
    warmupType() { return this.playerData?.warmupType; },
    multirateEnabled() { return this.playerData?.multirateEnabled; },
    definitions() { return this.playerData?.definitions; },
    currentDefinition() { return this.playerData?.currentDefinition; },
    currentRate() { return this.playerData.currentRate; },
    playerStatus() { return this.playerData?.playerStatus; },
    streamType() { return this.playerData?.streamType; },
    isPlayed() { return this.playerData?.isPlayed; },
    closedRoom() { return this.portraitData.closedRoom; },

    // 是否处于回放中
    isPlaybacking() {
      return this.isAppointVideo || this.channelData?.watchStatus === 'playback';
    },

    // 是否指定回放
    isAppointVideo() {
      return !!this.portrait?.vid || !!this.vid;
    },

    playerInited() {
      return this.getPlayerCtrl();
    },

    /**
     * 是否有音视频状态(或)
     * 1. 有直播
     * 2. 没直播但有暖场视频
     * 3. 正在回放
     */
    hasVideo() {
      const rule1 = this.liveStatus === 'live';
      const rule2 = this.liveStatus !== 'live' && this.warmupType === 'video';
      const rule3 = this.isPlaybacking;
      return rule1 || rule2 || rule3;
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
      const rule4 = this.playerInited;
      return rule1 && rule2 && rule3 && rule4;
    },

    /**
     * 是否显示暂无直播
     * 1. 当前没直播
     * 2. 没设置暖场内容
     * 3. 当前不是回放中
     */
    notLiveVisible() {
      const rule1 = this.liveStatus !== 'live';
      const rule2 = this.warmupType === '';
      const rule3 = !this.isPlaybacking;
      const rule4 = this.playerInited;
      return rule1 && rule2 && rule3 && rule4;
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
      const rule1 = this.liveStatus === 'live' || this.isPlaybacking;
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
     * 是否显示倍速切换
     * 1. ios系统
     * 2. 回放中
     */
    setRateVisible() {
      const rule1 = isIOS();
      const rule2 = this.isPlaybacking;
      return rule1 && rule2;
    },

    /**
     * 播放器菜单栏是否显示(或)
     * 1. 可以设置音视频切换
     * 2. 可以设置多码率
     */
    playerMenuBarVisible() {
      return this.setPlayModeVisible || this.setMultirateVisible || this.setRateVisible;
    },

    // 道具打赏开关
    donateGoodEnabled() {
      const channel = this.channelData;
      return this.ynToBool(channel?.donateSetting?.donateGoodEnabled || 'Y');
    },

    // 商品库开关
    productEnabled() {
      const channel = this.channelData;
      const menus = channel.channelMenus || [];
      for (let i = 0; i < menus.length; i++) {
        if (menus[i].menuType === 'buy') {
          return true;
        }
      }
      return false;
    },

    // 点赞是否显示
    likeVisible() {
      return !this.isPlaybacking;
    },

    /**
     * 进度条是否显示
     * 1. 回放中
     * 2. 正片已开始播放
     */
    progressBarVisible() {
      const rule1 = this.isPlaybacking;
      const rule2 = this.isPlayed;
      return rule1 && rule2;
    },

    /**
     * 进度条是否占据一整行
     * 判断规则：底部左侧有按钮则占据一整行
     * 1. 回放发送消息按钮显示了
     * 2. 回放列表或章节按钮显示了
     */
    progressBarIsBlock() {
      return this.leftBottomHasSomething;
    },

    /**
     * 回放类型
     * null: 无回放
     * single: 单个视频回放
     * list: 列表回放
     */
    playbackType() {
      return this.channelData?.playbackType;
    },

    /**
     * 回放列表是否显示
     * 1. 页面处于回放状态中
     * 2. 回放类型是列表回放
     * 3. 当前不是回放地址
     */
    playbackListVisible() {
      const rule1 = this.isPlaybacking;
      const rule2 = this.playbackType === 'list';
      return rule1 && rule2;
    },

    /**
     * 回放下的发送消息按钮是否显示
     * 1. 回放中
     * 2. 聊天未被关闭
     */
    sendMsgBtnVisible() {
      const rule1 = this.isPlaybacking;
      const rule2 = !this.closedRoom;
      return rule1 && rule2;
    },

    /**
     * 聊天室列表的样式
     * 1. 非回放下：46px
     * 2. 回放+进度条显示+进度条block显示：85px
     * 3. 回放+进度条显示+进度条inline显示：46px
     */
    chatListStyle() {
      const style = {
        bottom: '62px'
      };
      if (this.isPlaybacking) {
        if (this.progressBarVisible && this.progressBarIsBlock) {
          // 进度条显示且占据一整行
          style.bottom = '100px';
        } else if (this.progressBarVisible && !this.progressBarIsBlock) {
          // 进度条显示且不占据一整行
          style.bottom = '62px';
        } else if (!this.progressBarVisible && !this.leftBottomHasSomething) {
          // 进度条不显示且左下角没有按钮
          style.bottom = '16px';
        }
      }
      return style;
    },

    /**
     * 章节是否显示
     * 1. 三分屏
     * 2. 回放中
     */
    chapterVisible() {
      const rule1 = this.isPPT;
      const rule2 = this.isPlaybacking;
      return rule1 && rule2;
    },

    /**
     * 左下角是否有按钮显示
     */
    leftBottomHasSomething() {
      return this.sendMsgBtnVisible;
    }
  },

  methods: {
    getPlayerCtrl() {
      return this.portrait?.playerCtrl;
    }
  }
};
