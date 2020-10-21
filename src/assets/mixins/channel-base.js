export default {
  props: {
    channel: Object
  },

  computed: {
    channelData() {
      return this.channel || this.channelDetail;
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
    }
  }
};
