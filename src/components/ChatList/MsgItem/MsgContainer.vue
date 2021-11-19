<template>
  <div class="c-msg-container">
    <actor-label
      :actor="actor"
      :userType="userType"
      v-if="actor" />
    <span class="c-msg-container__nick">{{ nick }}：</span>
    <slot></slot>
  </div>
</template>

<script>
import ActorLabel from './ActorLabel';

export default {
  props: {
    msg: Object
  },

  computed: {
    nick() {
      return this.msg?.user?.nick || this.msg?.nick || '用户昵称';
    },
    actor() {
      return this.msg?.user?.actor;
    },
    userType() {
      return this.msg?.user?.userType;
    },
  },

  components: {
    ActorLabel
  }
};
</script>

<style lang="scss">
.c-msg-container {
  clear: left;
  overflow: hidden;
}
.c-msg-container__label {
  font-size: 14px;
  color: #fff;
  margin-right: 4px;
  border-radius: 6px;
  float: left;
  height: 12px;
  line-height: 12px;
  position: relative;
  top: 3px;
  vertical-align: middle;
  display: flex;
  justify-content: center;
  align-items: center;
}
.c-msg-container__label span {
  display: inline-block;
  transform: scale(.75, .75);
  word-break: keep-all;
}
.c-msg-container__nick {
  color: #FFD16B;
  font-size: 14px;
  float: left;
}
</style>
