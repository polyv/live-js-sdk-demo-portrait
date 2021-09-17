<template>
  <check-in-comp
    v-show="isShowCheckIn"
    :check-in-sdk="checkInInstance"
    @to-show="onSetCheckInVisible(true)"
    @to-hide="onSetCheckInVisible(false)"/>
</template>

<script>
import CheckInComp from '@polyv/interactions-receive-sdk-scene-default/lib/PortraitCheckIn';
import { CheckIn } from '@polyv/interactions-receive-sdk';
export default {
  components: {
    CheckInComp
  },

  data() {
    return {
      // 签到 SDK 实例
      checkInInstance: null,
      // 是否展示签到
      isShowCheckIn: false,
    };
  },

  created() {
    this.checkInInstance = new CheckIn();
  },

  beforeDestroy() {
    this.destroy();
  },

  methods: {
    onSetCheckInVisible(isShowCheckIn) {
      this.isShowCheckIn = isShowCheckIn;
    },

    destroy() {
      this.checkInInstance && this.checkInInstance.destroy();
      this.checkInInstance = null;
    },
  },
};
</script>

<style>
.plv-check-in-portrait {
  z-index: 9999;
}
</style>
