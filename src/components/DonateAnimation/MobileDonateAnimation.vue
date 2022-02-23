<!-- @file 移动端打赏大动画特效 -->

<template>
  <div class="c-donate-animation g-iphone-x-pb">
    <div class="c-donate-animation__wrap">
      <div
        id="donateAnimation"
        class="c-donate-animation__content"></div>
    </div>
  </div>
</template>

<script>
import { liveSdk, PolyvLiveSdk } from '../../assets/live-sdk/live-sdk';
import mixin from './mixin';

export default {
  mixins: [mixin],

  mounted() {
    liveSdk.on(PolyvLiveSdk.EVENTS.REWARD, this.handleRewardSocket);
  },

  beforeDestroy() {
    liveSdk.off(PolyvLiveSdk.EVENTS.REWARD, this.handleRewardSocket);
  },
};
</script>

<style>
.c-donate-animation {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  pointer-events: none;
  z-index: 30;
}
.c-donate-animation__wrap {
  width: 100%;
  height: 0;
  padding-bottom: 76.5%;
  position: absolute;
  bottom: 100%;
  left: 0;
}
.c-donate-animation__content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}
</style>
