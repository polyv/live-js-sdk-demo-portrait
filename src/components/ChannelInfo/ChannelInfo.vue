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
        @click="alert('a')"
        class="c-channel-info__text__online">
        <i class="g-icon i-eye"></i>
        <span>{{ onlineUserNumber }}</span>
      </div>
    </div>
    <!-- 关注 -->
    <button
      v-if="ynToBool(channel.channelPromotion.followEnabled)"
      class="c-channel-info__btn"
      @click="handleFollow">
      <span>{{ channel.channelPromotion.followEntrance }}</span>
    </button>
  </div>
</template>

<script>
import channelBaseMixin from '../../assets/mixins/channel-base';
import { liveSdk, PolyvLiveSdk } from '../../assets/live-sdk/live-sdk';

export default {
  mixins: [channelBaseMixin],

  computed: {
    publisher() {
      return this.channel?.publisher;
    },
    coverImage() {
      return this.channel?.coverImage;
    },
    followEnabled() {
      return this.ynToBool(this.channel?.channelPromotion?.followEnabled || 'N');
    },
    followEntrance() {
      return this.channel?.channelPromotion?.followEntrance;
    }
  },

  methods: {
    handleFollow() {
      this.$emit('follow');
    },
    handleOnlineChange(event, data) {
      if (this.portrait) {
        this.portrait.$set(this.portrait.portraitState, 'onlineUserNumber', data.onlineUserNumber);
      }
    },
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
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 36px;
  border-radius: 18px;
  background: rgba(0, 0, 0, .4);
  position: absolute;
  top: 15px;
  left: 15px;
  box-sizing: border-box;
  color: #fff;
  z-index: 30;
}
.c-channel-info__avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  margin-left: 4px;
}
.c-channel-info__text {
  margin: 0 8px;
}
.c-channel-info__text__name {
  font-size: 14px;
  line-height: 16px;
  max-width: 70px;
}
.c-channel-info__text__online {
  display: flex;
  align-items: center;
  margin-top: 2px;
}
.c-channel-info__text__online .i-eye {
  width: 12px;
  height: 12px;
  display: inline-block;
  margin-right: 2px;
  flex-shrink: 0;
}
.c-channel-info__text__online span {
  font-size: 10px;
  transform: translateY(1px);
}
.c-channel-info__btn {
  margin-right: 8px;
  z-index: 10;
  max-width: 128px;
  height: 24px;
  background: #FFA611;
  border-radius: 12px;
  color: #FFFFFF;
  border: none;
}
.c-channel-info__btn span {
  padding: 8px;
  white-space: nowrap;
}
</style>
