<template>
  <msg-container
    class="c-speak-msg"
    :msg="msg">
    <span v-html="parseContent"></span>
  </msg-container>
</template>

<script>
import MsgContainer from './MsgContainer';
import { parseEmotions } from '@polyv/emotion-sdk';

export default {
  components: {
    MsgContainer
  },

  props: {
    msg: Object
  },

  computed: {
    parseContent() {
      return parseEmotions(this.msg.content, 1);
    }
  }
};
</script>

<style>
.c-speak-msg {
  font-size: 12px;
}
.c-speak-msg .plv-emotion-img {
  width: 16px !important;
  height: 16px !important;
  transform: translateY(-1px);
}
</style>
