import { liveSdk, PolyvLiveSdk } from '../../assets/live-sdk/live-sdk';
import { htmlStr2Text } from '../../assets/utils/utils';

export default {
  data() {
    return {
      bulletin: ''
    };
  },

  computed: {
    bulletinText() {
      return htmlStr2Text(this.bulletin);
    }
  },

  created() {
    liveSdk.on(PolyvLiveSdk.EVENTS.BULLETIN, this.handleBulletin);
    liveSdk.on(PolyvLiveSdk.EVENTS.REMOVE_BULLETIN, this.handleRemoveBulletin);
  },

  beforeDestroy() {
    liveSdk.off(PolyvLiveSdk.EVENTS.BULLETIN, this.handleBulletin);
    liveSdk.off(PolyvLiveSdk.EVENTS.REMOVE_BULLETIN, this.handleRemoveBulletin);
  },

  methods: {
    handleBulletin(event, data) {
      this.bulletin = data?.content || '';
    },
    handleRemoveBulletin() {
      this.bulletin = '';
    }
  }
};
