import { FEED_BACK_VISIBLE, bus } from '../../assets/utils/event-bus';
import { geFeedBackSdk } from './feed-back';

export default {
  data() {
    return {
      // 举报反馈/投诉 SDK 实例
      feedBackSdk: geFeedBackSdk(),
      // 是否展示反馈
      isShowFeedBack: false,
    };
  },

  computed: {
    feedBackTitle() {
      return '举报反馈'; // 投诉
    }
  },

  created() {
    this.bindEvts();
  },

  beforeDestroy() {
    this.destroy();
    this.unbindEvts();
  },

  methods: {
    bindEvts() {
      bus.$on(FEED_BACK_VISIBLE, this.onShowFeedBack);
    },
    unbindEvts() {
      bus.$off(FEED_BACK_VISIBLE, this.onShowFeedBack);
    },
    onSetFeedBackVisible(isShowFeedBack) {
      this.isShowFeedBack = isShowFeedBack;
    },
    onShowFeedBack() {
      this.onSetFeedBackVisible(true);
    },
    onCloseModal() {
      this.onSetFeedBackVisible(false);
    },
    destroy() {
      this.feedBackSdk && this.feedBackSdk.destroy();
      this.feedBackSdk = null;
    },
  },
};
