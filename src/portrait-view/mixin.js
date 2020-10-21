import { liveSdk, PolyvLiveSdk } from '../assets/live-sdk/live-sdk';
import donateApi from '../assets/api/donate';
import { bus, SWIPER_CHANGE } from '../assets/utils/event-bus';

export default {
  data() {
    return {
      swiperOptions: {
        autoplay: false,
        loop: false,
        initialSlide: 1,
        on: {
          slideChange: () => {
            this.handleSwiperChange();
          }
        }
      }
    };
  },

  methods: {
    initSdkEvent() {
      liveSdk.on(PolyvLiveSdk.EVENTS.CHANNEL_DATA_INIT, (event, data) => {
        this.channelDetail = data;
        this.getDonateSetting();
      });
      liveSdk.on(PolyvLiveSdk.EVENTS.STREAM_UPDATE, (event, status) => {
        this.channelDetail.watchStatus = status === 'live' ? 'live' : 'end';
        liveSdk.reloadPlayer();
      });
      liveSdk.on(PolyvLiveSdk.EVENTS.PRODUCT_MESSAGE, this.handleProductSocket);
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
    }
  }
};
