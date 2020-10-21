<template>
  <div
    class="c-input-tips"
    :class="{
      'c-input-tips--disabled': closedRoom
    }"
    @click="handleClick">
    <span class="g-icon i-msg"></span>
    <span class="c-input-tips__text">{{ tipsText }}</span>
  </div>
</template>

<script>
import { liveSdk, PolyvLiveSdk } from '../../assets/live-sdk/live-sdk';
import { bus, CHAT_INPUT_VISIBLE } from '../../assets/utils/event-bus';

export default {
  data() {
    return {
      closedRoom: false
    };
  },

  computed: {
    tipsText() {
      return this.closedRoom ? '聊天室暂时关闭' : '跟大家聊点什么吧~';
    }
  },

  methods: {
    handleClick(event) {
      if (this.closedRoom) return;
      bus.$emit(CHAT_INPUT_VISIBLE, true);
    },
    handleCloseRoom(event, data) {
      this.closedRoom = data?.value?.closed;
    }
  },

  mounted() {
    liveSdk.on(PolyvLiveSdk.EVENTS.CLOSE_ROOM, this.handleCloseRoom);
  },

  beforeDestroy() {
    liveSdk.off(PolyvLiveSdk.EVENTS.CLOSE_ROOM, this.handleCloseRoom);
  }
};
</script>

<style>
.c-input-tips {
  width: 165px;
  height: 32px;
  border-radius: 16px;
  background: rgba(0, 0, 0, .4);
  display: flex;
  align-items: center;
  padding-left: 8px;
  box-sizing: border-box;
}
.c-input-tips.c-input-tips--disabled {
  opacity: .6;
}
.c-input-tips__text {
  color: rgba(255, 255, 255, .6);
  font-size: 14px;
}
.c-input-tips .i-msg {
  width: 16px;
  height: 16px;
  margin-right: 6px;
}
</style>
