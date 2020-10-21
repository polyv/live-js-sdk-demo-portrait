<template>
  <div class="c-msg-container">
    <span
      v-if="actor"
      :class="[
        'c-msg-container__label',
        'c-msg-container__label--' + userType
      ]"
      :style="{
        background: actorColor
      }">
      <span>{{ actor }}</span>
    </span>
    <span class="c-msg-container__nick">{{ nick }}：</span>
    <slot></slot>
  </div>
</template>

<script>
// 标签颜色
const actorColor = {
  manager: '#33BBC5',
  assistant: '#598FE5',
  teacher: '#F09343',
  guest: '#EB6165'
};

export default {
  props: {
    msg: Object
  },

  computed: {
    nick() {
      return this.msg?.user?.nick || '用户昵称';
    },
    actor() {
      return this.msg?.user?.actor;
    },
    userType() {
      return this.msg?.user?.userType;
    },
    actorColor() {
      return this.userType ? actorColor[this.userType] : '';
    }
  }
};
</script>

<style>
.c-msg-container {
  clear: left;
  overflow: hidden;
}
.c-msg-container__label {
  font-size: 12px;
  color: #fff;
  margin-right: 4px;
  padding: 0 4px;
  border-radius: 6px;
  float: left;
  height: 12px;
  line-height: 12px;
  position: relative;
  top: 3px;
  vertical-align: middle;
}
.c-msg-container__label.c-msg-container__label--manager {
  padding: 0 2px;
}
.c-msg-container__label span {
  display: inline-block;
  transform: scale(.75, .75);
}
.c-msg-container__nick {
  color: #FFD16B;
  font-size: 12px;
  float: left;
}
</style>
