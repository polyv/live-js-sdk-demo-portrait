<template>
  <div class="c-donate-tips">
    <transition
      name="c-donate-tips-in"
      @enter="handleEnter"
      @leave="handleLeave">
      <div
        v-if="tipsVisible === 2"
        class="c-donate-tips__content g-img-cover">
        <div class="c-donate-tips__info">
          <div class="c-donate-tips__info__nick g-singleline">{{ reward.content.unick }}</div>
          <div class="c-donate-tips__info__reward-name">
            赠送
            <span>{{ reward.content.rewardContent }}</span>
          </div>
        </div>
        <img
          class="c-donate-tips__reward-img"
          :src="reward.content.gimg" />
      </div>
    </transition>
  </div>
</template>

<script>
import { liveSdk, PolyvLiveSdk } from '../../assets/live-sdk/live-sdk';

export default {
  data() {
    return {
      // 打赏消息队列
      rewardQueue: [],
      reward: null,
      // 打赏提示显示状态 0-没显示，1-显示但正在动画中，2-已显示
      tipsVisible: 0,
      showingRewardTimer: null
    };
  },

  mounted() {
    liveSdk.on(PolyvLiveSdk.EVENTS.REWARD, this.handleReward);
    this.showingRewardTimer = setInterval(this.handleNewReward, 300);
  },

  beforeDestroy() {
    liveSdk.off(PolyvLiveSdk.EVENTS.REWARD, this.handleReward);
  },

  methods: {
    handleReward(event, data) {
      this.rewardQueue.push(data);
    },
    handleEnter() {
      setTimeout(() => {
        this.tipsVisible = 1;
      }, 2000);
    },
    handleLeave() {
      this.tipsVisible = 0;
      this.reward = null;
    },
    handleNewReward() {
      if (this.tipsVisible !== 0) return;
      const len = this.rewardQueue.length;

      if (len) {
        this.reward = this.rewardQueue[0];
        this.tipsVisible = 2;
        this.rewardQueue = this.rewardQueue.slice(1);
      }
    }
  }
};
</script>

<style>
.c-donate-tips {
  pointer-events: none;
  position: absolute;
  bottom: 295px;
  left: 0;
  width: 270px;
  height: 56px;
  overflow: hidden;
  display: flex;
  line-height: 1;
}
.c-donate-tips__content {
  width: 270px;
  height: 40px;
  background-image: url(./imgs/donate-tips-bg.png);
  margin-top: auto;
  padding-left: 16px;
  display: flex;
  align-items: flex-end;
}
.c-donate-tips__info {
  max-width: 124px;
  height: 40px;
  box-sizing: border-box;
  padding-top: 6px;
}
.c-donate-tips__info__nick {
  color: #FCF2A6;
  font-size: 14px;
  margin-bottom: 4px;
}
.c-donate-tips__info__reward-name {
  font-size: 10px;
  color: #fff;
}
.c-donate-tips__info__reward-name span {
  margin-left: 8px;
}
.c-donate-tips__reward-img {
  width: 56px;
  height: 56px;
  margin-left: 10px;
  object-fit: cover;
}

.c-donate-tips-in-enter-active,
.c-donate-tips-in-leave-active {
  margin-left: 0;
  transition: margin-left .5s;
}
.c-donate-tips-in-enter,
.c-donate-tips-in-leave-active {
  margin-left: -100%;
}
</style>
