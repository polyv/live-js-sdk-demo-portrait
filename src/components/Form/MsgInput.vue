<template>
  <div
    v-if="visible"
    class="c-msg-input"
    v-click-out-side="close">
    <form action="#" @submit="handleSubmit">
      <input
        class="c-msg-input__inner"
        placeholder="跟大家聊点什么吧~"
        type="text"
        ref="input"
        maxlength="200"
        v-model="content"
        @blur="handleInputBlur" />
      <button
        v-if="content"
        type="submit"
        class="c-msg-input__btn">发送</button>
    </form>
  </div>
</template>

<script>
import {
  bus,
  SELF_SPEAK,
  CHAT_INPUT_VISIBLE,
  KEYBOARD_HIDE
} from '../../assets/utils/event-bus';

export default {
  data() {
    return {
      content: '',
      visible: false
    };
  },

  methods: {
    handleSubmit(event) {
      event && event.preventDefault();
      if (!this.content) return;
      bus.$emit(SELF_SPEAK, this.content);
      this.close();
      this.content = '';
    },
    handleVisible(visible) {
      this.visible = visible;
      if (visible) {
        this.$nextTick(() => {
          this.$refs.input.focus();
        });
      }
    },
    handleInputBlur() {
      setTimeout(() => {
        this.close();
      }, 100);
    },
    handleKeyboardHide() {
      this.close();
    },
    close() {
      this.visible = false;
    }
  },

  mounted() {
    document.body.appendChild(this.$el);
    bus.$on(CHAT_INPUT_VISIBLE, this.handleVisible);
    bus.$on(KEYBOARD_HIDE, this.handleKeyboardHide);
  },

  beforeDestroy() {
    bus.$off(CHAT_INPUT_VISIBLE, this.handleVisible);
    bus.$off(KEYBOARD_HIDE, this.handleKeyboardHide);
  }
};
</script>

<style>
.c-msg-input {
  background: rgba(0, 0, 0, .8);
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
}
.c-msg-input form {
  display: flex;
}
.c-msg-input__inner {
  flex: 1;
  height: 44px;
  font-size: 14px;
  outline: none;
  background: none;
  border: none;
  color: #fff;
  padding: 0 8px;
  caret-color: #ffc815;
  display: block;
  width: 100%;
  box-sizing: border-box;
  resize: none;
}
.c-msg-input__btn {
  height: 44px;
  line-height: 44px;
  width: 60px;
  text-align: center;
  font-size: 14px;
  color: #fff;
  background: #FFA611;
}
.c-msg-input__btn.c-msg-input__btn--disabled {
  background: #C4C4C4;
}
</style>
