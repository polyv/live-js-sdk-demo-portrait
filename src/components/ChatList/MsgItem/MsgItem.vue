<template>
  <div
    data-player-click
    class="c-msg-item">
    <div class="c-msg-item__content">
      <component
        :is="componentName"
        :msg="msg" />
    </div>
  </div>
</template>

<script>
import { msgSource } from '../../../assets/chat/constants';
import SpeakMsg from './SpeakMsg';
import ChatImgMsg from './ChatImgMsg';

const msgComponent = {
  [msgSource.speak]: 'speak-msg',
  [msgSource.chatImg]: 'chat-img-msg'
};

export default {
  props: {
    msg: Object
  },

  components: {
    SpeakMsg,
    ChatImgMsg
  },

  computed: {
    componentName() {
      return msgComponent[this.msg.msgSource];
    }
  }
};
</script>

<style>
.c-msg-item {
  margin-bottom: 4px;
  overflow: hidden;
  font-size: 12px;
}
.c-msg-item__content {
  display: inline-block;
  background: rgba(0, 0, 0, .39);
  border-radius: 10px;
  padding: 2px 8px;
  line-height: 18px;
  transition: .2s;
}
</style>
