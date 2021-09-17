import { liveSdk, PolyvLiveSdk } from '../assets/live-sdk/live-sdk';
import donateApi from '../assets/api/donate';
import { bus, SWIPER_CHANGE } from '../assets/utils/event-bus';
import channelApi from '../assets/api/channel';
import { config } from '../assets/utils/config';
import { updateConfig } from '@polyv/interactions-receive-sdk';

export default {
  data() {
    return {
      clientHeight: document.documentElement.clientHeight,
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
        chapterList: [],
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
    // 处理sdk初始化完成，监听事件
    initSdkEvent() {
      liveSdk.on(PolyvLiveSdk.EVENTS.CHANNEL_DATA_INIT, (event, data) => {
        this.channelDetail = data;
        this.getDonateSetting();
        this.setUpdateConfig();
      });
      // 监听直播流状态改变事件
      liveSdk.on(PolyvLiveSdk.EVENTS.STREAM_UPDATE, (event, status) => {
        if (this.isPlaybacking) { return; }
        this.channelDetail.watchStatus = status === 'live' ? 'live' : 'end';
        this.playerState.liveStatus = this.channelDetail.watchStatus;
        liveSdk.reloadPlayer();
      });
      // 监听商品库事件
      liveSdk.on(PolyvLiveSdk.EVENTS.PRODUCT_MESSAGE, this.handleProductSocket);
      // 监听聊天室开关事件
      liveSdk.on(PolyvLiveSdk.EVENTS.CLOSE_ROOM, this.handleCloseRoom);
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
    },

    // 初始化互动功能的参数
    setUpdateConfig() {
      updateConfig({
        socket: liveSdk.socket,
        userInfo: Object.assign({}, {
          userId: config.user.userId,
          pic: config.user.avatar,
          nick: config.user.userName,
        }),
        channelInfo: Object.assign({}, {
          channelId: config.channelId,
          sessionId: this.channelDetail.sessionId,
          roomId: this.channelDetail.roomId || this.channelDetail.channelId,
        }),
        getChannelToken: this.getChannelToken,
      });
    },

    // 获取当前的token
    async getChannelToken(cb) {
      let res;
      try {
        res = await channelApi.getChannelToken();
      } catch (e) {
        this.$error(`获取token失败:${e}`);
      }
      if (res?.data?.token) {
        const channelToken = res?.data?.token;
        // eslint-disable-next-line standard/no-callback-literal
        cb && cb({ channelToken: channelToken });
      }
    },
  }
};
