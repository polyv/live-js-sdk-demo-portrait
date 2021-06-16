<template>
  <div
    class="c-input-tips"
    :class="{
      'c-input-tips--disabled': closedRoom
    }">
    <span class="g-icon i-msg"></span>
    <span class="c-input-tips__text">{{ tipsText }}</span>
  </div>
</template>

<script>
import channelBaseMixin from '../../assets/mixins/channel-base';

export default {
  mixins: [channelBaseMixin],

  computed: {
    tipsText() {
      return this.closedRoom ? '聊天室暂时关闭' : '来聊点什么吧~';
    }
  },
};
</script>

<style>
.c-input-tips {
  flex: 1;
  margin-right: 16px;
  max-width: 165px;
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
