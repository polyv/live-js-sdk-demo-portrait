<script>
export default {
  props: {
    title: String,
    cancelText: {
      type: String,
      default: '按错了'
    },
    confirmText: {
      type: String,
      default: '挂断'
    }
  }
};
</script>

<template>
  <div class="c-dialog">
    <div class="c-dialog__text">{{ title }}</div>
    <div class="c-dialog__footer">
      <div class="c-dialog__footer-cancel" @click="$emit('cancel')">{{ cancelText }}</div>
      <div class="c-dialog__footer-confirm" @click="$emit('confirm')">{{ confirmText }}</div>
    </div>
  </div>
</template>

<style scoped>
.c-dialog {
  position: fixed;
  z-index: 1111;
  width: 240px;
  height: 116px;
  top: 30%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  border-radius: 10px;
  overflow: hidden;
  color: #fff;
  font-size: 14px;
}
.c-dialog__text {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 28px;
}
.c-dialog__footer {
  display: flex;
  margin-top: 27px;
  height: 43px;
}
.c-dialog__footer-cancel {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
}
.c-dialog__footer-confirm {
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FF6A5D;
  width: 50%;
}
</style>
