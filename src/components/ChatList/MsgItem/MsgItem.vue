<template>
  <div
    data-player-click
    class="c-msg-item">
    <div
      :class="[
        'c-msg-item__content',
        msgVisible ? '' : 'c-msg-item__content--unvisible'
      ]">
      <msg-container :msg="msg" :class="componentName === 'speak-msg' ? 'c-speak-msg' : ''">
        <component
          :is="componentName"
          :msg="msg" />
        <msg-container
          v-if="msg.quote"
          class="c-msg-item__quote"
          :msg="msg.quote">
          <div class="c-msg-item__quote__content-line"></div>
          <div class="c-msg-item__quote__content-main">
            <component
              :is="quoteComponentName"
              :msg="msg.quote" />
          </div>
        </msg-container>
      </msg-container>
    </div>
  </div>
</template>

<script>
import { msgSource } from '../../../assets/chat/constants';
import { tryParseJSON } from '@polyv/utils/src/lang';
import { parseEmotions } from '@polyv/emotion-sdk';
import SpeakMsg from './SpeakMsg';
import ChatImgMsg from './ChatImgMsg';
import EmotionImgMsg from './EmotionImgMsg';
import MsgContainer from './MsgContainer';

const msgComponent = {
  [msgSource.speak]: 'speak-msg',
  [msgSource.chatImg]: 'chat-img-msg',
  [msgSource.emotionImg]: 'emotion-img-msg',
};

export default {
  data() {
    return {
      msgVisible: false
    };
  },

  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.msgVisible = true;
      }, 100);
    });
  },

  props: {
    msg: Object
  },

  components: {
    SpeakMsg,
    ChatImgMsg,
    EmotionImgMsg,
    MsgContainer
  },

  computed: {
    componentName() {
      return msgComponent[this.msg.msgSource];
    },
    quoteComponentName() {
      if (this.msg.quote.image) { // 回复功能判断
        return 'chat-img-msg';
      }
      return msgComponent[this.msg.msgSource];
    }
  },
  // 公屏回复原始消息处理
  processedOriginContent() {
    if (!this.msg.quote) { return; }
    let originContent = this.msg.quote.content;
    // 尝试作为json解析(公屏回复红包消息时)
    const jsonContent = tryParseJSON(this.msg.quote.content);
    if (typeof jsonContent === 'object') {
      originContent = parseEmotions(jsonContent?.content || '');
    } else {
      originContent = parseEmotions(originContent);
    }
    return originContent;
  },
};
</script>

<style lang="scss">
.c-msg-item {
  margin-bottom: 4px;
  display: inline-block;
  overflow: hidden;
  font-size: 12px;
  border-radius: 14px;
  background: rgba(51, 51, 51, 0.6);
}
.c-msg-item__content {
  display: inline-block;
  border-radius: 14px;
  padding: 8px 16px;
  line-height: 18px;
  transform: translateX(0);
  transition: .2s;
}
.c-msg-item__quote__content-line {
  position: absolute;
  width: 100%;
  left: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}
.c-msg-item__quote__nick, .c-msg-item__quote__content-main {
  color: #D6D6D6;
  margin-top: 5px;
}
.c-msg-item__quote .c-msg-container__nick {
  margin-top: 8px;
}
.c-msg-item__quote {
  padding-top: 4px;
}
</style>
