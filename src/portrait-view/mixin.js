import { liveSdk, PolyvLiveSdk } from '../assets/live-sdk/live-sdk';
import donateApi from '../assets/api/donate';
import { bus, SWIPER_CHANGE } from '../assets/utils/event-bus';
// 新版互动SDK
import { updateConfig as updateInteractiveSdkV2Config } from '@polyv/interactions-receive-sdk';
import channelApi from '../assets/api/channel';
import axios from '../assets/api/axios';
import { genSign } from '../assets/utils/string';
import debounce from 'lodash-es/debounce';
import { config } from '../assets/utils/config';

export default {
  data() {
    return {
      clientHeight: document.documentElement.clientHeight,
      clientWidth: document.documentElement.clientWidth,
      // 轮播组件配置
      swiperOptions: {
        autoplay: false,
        loop: false,
        initialSlide: 1,
        on: {
          slideChange: () => {
            this.handleSwiperChange();
          }
        }
      },
      portraitState: {
        playbackList: [], // TODO 回放列表
        chapterList: [], // 章节列表
        currentPlaying: {}, // 当前播放
        documentSwitch: true, // 文档开关
        documentProportion: 1, // 文档比例尺寸
        onlineUserNumber: 0, // 聊天室在线人数
        closedRoom: false, // 聊天室是否已关闭
      },
    };
  },

  provide() {
    return {
      portrait: this
    };
  },

  computed: {
    watchStyle() {
      if (this.isSmallWindow) {
        return {
          height: '100%',
        };
      }
      const style = {
        height: `${this.clientHeight}px`
      };
      if (this.isPPT) {
        style.paddingTop = `${this.docWrapHeight}px`;
      }
      return style;
    }
  },

  methods: {
    async getViewerApiToken(cb) {
      const { data: detailData } = await channelApi.getChannelDetail();
      this.detailData = detailData;
      try {
        const requestData = {
          appId: config.appId,
          timestamp: new Date().getTime(),
          channelId: config.channelId,
          viewerId: config.user.userId,
        };
        requestData.sign = genSign(requestData, config.appSecret);
        const res = await axios.post('/live/v3/channel/watch/get-api-token', requestData, { ignoreSign: true });
        if (res?.data) {
          const token = res.data.token;
          /* eslint-disable */
          cb && cb({ viewerApiToken: token });
        }
      } catch (e) {}
    },
    // 处理sdk初始化完成，监听事件
    initSdkEvent() {
      liveSdk.on(PolyvLiveSdk.EVENTS.CHANNEL_DATA_INIT, (event, data) => {
        this.channelDetail = data;
        this.getDonateSetting();
        const { channelDetail } = this;
        updateInteractiveSdkV2Config({
          getViewerApiToken: this.getViewerApiToken,
          socket: liveSdk.socket,
          userInfo: {
            nick: config.user.userName,
            pic: config.defaultAvatar,
            userId: config.user.userId
          },
          channelInfo: {
            channelId: channelDetail.channelId,
            roomId: channelDetail.roomId,
            sessionId: channelDetail.sessionId
          }
        });
      });
      // 监听直播流状态改变事件
      liveSdk.on(PolyvLiveSdk.EVENTS.STREAM_UPDATE, (event, status) => {
        if (this.isAppointVideo) { return; } // vid指定回放下, 不监听流状态
        this.channelDetail.watchStatus = status;
        this.playerState.liveStatus = this.channelDetail.watchStatus;
        liveSdk.reloadPlayer();
      });
      // 监听商品库事件
      liveSdk.on(PolyvLiveSdk.EVENTS.PRODUCT_MESSAGE, this.handleProductSocket);
      // 监听聊天室关闭事件
      liveSdk.on(PolyvLiveSdk.EVENTS.CLOSE_ROOM, this.handleCloseRoom);
      // 监听聊天室开启事件
      liveSdk.on(PolyvLiveSdk.EVENTS.OPEN_ROOM, this.handleCloseRoom);
      // 监听章节初始化事件
      liveSdk.on(PolyvLiveSdk.EVENTS.PLAYBACK_INIT, this.handlePlaybackInit);
      // 监听用户被踢出事件
      liveSdk.on(PolyvLiveSdk.EVENTS.BAN_USER_ROOM, this.handleBanUserRoom);
      // 监听用户被拒绝登陆
      liveSdk.on(PolyvLiveSdk.EVENTS.LOGIN_REFUSE, this.handleBanUserRoom);
      // 监听用户重复登录
      liveSdk.on(PolyvLiveSdk.EVENTS.RELOGIN, this.handleRelogin);
    },

    // 处理聊天室开关事件
    handleCloseRoom(event, data) {
      this.$set(this.portraitState, 'closedRoom', data?.value?.closed);
    },

    // 获取打赏信息
    async getDonateSetting() {
      const { data } = await donateApi.getDonateDetail();
      this.$set(this.channelDetail, 'donateSetting', data);
    },

    // 处理轮播事件
    handleSwiperChange() {
      bus.$emit(SWIPER_CHANGE);
    },

    // 处理商品库事件，控制商品库显示与隐藏
    handleProductSocket(event, data) {
      const status = Number(data.status);
      const enabled = data.content.enabled;
      if (status !== 10 && !this.app) { return; }
      let channelMenus = this.channelDetail.channelMenus;
      if (enabled === 'N') {
        channelMenus = channelMenus.filter((menu) => menu.menuType !== 'buy');
      } else {
        channelMenus.push(data.content);
      }
      this.$set(this.channelDetail, 'channelMenus', channelMenus);
    },

    // 处理回放章节初始化完成
    handlePlaybackInit(event, data) {
      liveSdk.getChapterLists(data.fileId, data.type).then((list) => {
        this.$set(this.portraitState, 'chapterList', list);
      });
    },

    // 处理当前用户被踢出房间
    handleBanUserRoom(evt) {
      console.info('当前用户被踢出了房间', evt);
      // TODO ....
    },

    // 处理重复登录
    handleRelogin(evt, data) {
      console.info(evt, data);
    }
  },

  mounted() {
    // 监听小窗口变化 改变文档等高度大小
    window.addEventListener('resize', debounce(() => {
      this.clientHeight = document.documentElement.clientHeight;
      this.clientWidth = document.documentElement.clientWidth;
    }, 60, { leading: true }));
  }
};
