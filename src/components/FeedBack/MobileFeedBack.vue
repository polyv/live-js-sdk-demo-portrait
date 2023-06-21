<template>
  <div>
    <popup
      :title="feedBackTitle"
      :visible="isShowFeedBack"
      @close="onCloseModal"
      fit-left-height
    >
      <feed-back
        :feed-back-sdk="feedBackSdk"
        :is-show-feed-back="isShowFeedBack"
        @to-show="onSetFeedBackVisible(true)"
        @to-hide="onSetFeedBackVisible(false)"
      />
    </popup>
  </div>
</template>

<script>
import mixin from './mixin';
import Popup from '../Popup/Popup.vue';
import FeedBack from '@polyv/interactions-receive-sdk-ui-default/lib/MobileFeedBack';

export default {
  components: {
    Popup,
    FeedBack
  },
  mixins: [mixin]
};
</script>
