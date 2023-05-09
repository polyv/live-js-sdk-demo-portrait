<template>
  <div v-show="isShowCheckIn">
    <Popup
      title="签到"
      :visible="isShowCheckIn"
      v-model="isShowCheckIn"
      @close="isShowCheckIn = false">
      <!-- 签到组件主体 -->
      <CheckIn
        :check-in-sdk="checkInSdk"
        @to-show="onSetCheckInVisible(true)"
        @to-hide="onSetCheckInVisible(false)" />
    </Popup>
  </div>
</template>

<script>
import { CheckIn as CheckInSDK } from '@polyv/interactions-receive-sdk';
import CheckIn from '@polyv/interactions-receive-sdk-ui-default/lib/PcCheckIn';
import Popup from '../Popup/Popup';

export default {
  name: 'checkIn',
  components: {
    CheckIn,
    Popup,
  },

  data() {
    return {
      // 签到SDK实例
      checkInSdk: null,
      // 是否显示签到
      isShowCheckIn: false,
    };
  },

  created() {
    this.checkInSdk = new CheckInSDK();
  },

  beforeDestroy() {
    if (this.checkInSdk) {
      this.checkInSdk.destroy();
    }
  },

  methods: {
    onSetCheckInVisible(visible) {
      this.isShowCheckIn = visible;
    },
  },
};
</script>
