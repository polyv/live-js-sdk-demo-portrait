<template>
  <div class="c-channel-info">
    <!-- 频道logo -->
    <img
      alt="头像"
      class="c-channel-info__avatar"
      :src="coverImage" />
    <div class="c-channel-info__text">
      <div class="c-channel-info__text__name g-singleline">{{ publisher }}</div>
      <!-- 在线人数 -->
      <div
        class="c-channel-info__text__online">
        <i class="g-icon i-eye"></i>
        <span>{{ onlineUserNumber }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import channelBaseMixin from '../../assets/mixins/channel-base';
import { liveSdk, PolyvLiveSdk } from '../../assets/live-sdk/live-sdk';

export default {
  mixins: [channelBaseMixin],

  data() {
    return {
      onlineUserNumber: 0,
    };
  },

  computed: {
    publisher() {
      return this.channel?.publisher;
    },
    coverImage() {
      return this.channel?.coverImage;
    }
  },

  methods: {
    handleOnlineChange(event, data) {
      this.onlineUserNumber = data.onlineUserNumber;
    }
  },

  mounted() {
    liveSdk.on(PolyvLiveSdk.EVENTS.LOGIN, this.handleOnlineChange);
    liveSdk.on(PolyvLiveSdk.EVENTS.LOGOUT, this.handleOnlineChange);
  },

  beforeDestroy() {
    liveSdk.off(PolyvLiveSdk.EVENTS.LOGIN, this.handleOnlineChange);
    liveSdk.off(PolyvLiveSdk.EVENTS.LOGOUT, this.handleOnlineChange);
  }
};
</script>

<style>
.c-channel-info {
  width: 118px;
  height: 36px;
  border-radius: 18px;
  background: rgba(0, 0, 0, .4);
  position: absolute;
  top: 15px;
  left: 15px;
  box-sizing: border-box;
  padding: 0 4px;
  display: flex;
  align-items: center;
  color: #fff;
  z-index: 11;
}
.c-channel-info__avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  margin-right: 4px;
}
.c-channel-info__text {
  flex: 1;
  overflow: hidden;
}
.c-channel-info__text__name {
  font-size: 14px;
  line-height: 1.2;
  margin-bottom: -2px;
}
.c-channel-info__text__online {
  display: flex;
  align-items: center;
}
.c-channel-info__text__online .i-eye {
  width: 12px;
  height: 12px;
  margin-right: 2px;
}
.c-channel-info__text__online span {
  font-size: 10px;
  transform: translateY(1px);
}
</style>
