<!-- @file 欢迎语组件 -->
<template>
  <div class="c-welcome">
    <transition
      name="c-welcome-in"
      @after-enter="handleAfterEnter"
      @after-leave="handleAfterLeave">
      <div
        v-show="welcomeVisible === 2"
        class="c-welcome__content g-singleline g-img-cover">欢迎 {{ nick }} 进入直播间</div>
    </transition>
  </div>
</template>

<script>
import { liveSdk, PolyvLiveSdk } from '../../assets/live-sdk/live-sdk';

export default {
  data() {
    return {
      nick: '',
      // 欢迎语显示状态 0-没显示，1-显示但正在动画中，2-已显示
      welcomeVisible: 0,
    };
  },

  created() {
    liveSdk.on(PolyvLiveSdk.EVENTS.LOGIN, this.handleLogin);
  },

  beforeDestroy() {
    liveSdk.off(PolyvLiveSdk.EVENTS.LOGIN, this.handleLogin);
    this.nick = '';
    this.welcomeVisible = 0;
  },

  methods: {
    handleLogin(eventm, data) {
      if (this.welcomeVisible !== 0) { return; }
      const user = data && data.user;
      this.nick = user.nick;
      this.welcomeVisible = 2;
    },

    handleAfterEnter() {
      setTimeout(() => {
        this.welcomeVisible = 1;
      }, 2 * 1000);
    },
    handleAfterLeave() {
      this.welcomeVisible = 0;
      this.nick = '';
    }
  }
};
</script>

<style>
.c-welcome {
  color: #fff;
  position: absolute;
  left: 0;
  bottom: 233px;
  width: 258px;
  height: 22px;
  overflow: hidden;
  pointer-events: none;
}

.c-welcome__content {
  width: 258px;
  height: 22px;
  line-height: 22px;
  box-sizing: border-box;
  padding: 0 15px;
  background-image: url(./imgs/welcome-bg.png);
}

.c-welcome-in-enter-active,
.c-welcome-in-leave-active {
  margin-left: 0;
  transition: margin-left .5s;
}
.c-welcome-in-enter,
.c-welcome-in-leave-active {
  margin-left: -100%;
}
</style>
