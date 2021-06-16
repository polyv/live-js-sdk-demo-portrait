<template>
  <div
    class="c-chat-list">
    <div class="c-chat-list__wrap">
      <better-scroll
        ref="scroll"
        @scrollTop="handleScrollTop"
        @scrollBottom="handleScrollBottom">
        <ul
          data-player-click
          class="c-chat-list__content">
          <template v-for="msg in msgList">
            <li
              :key="msg.id"
              :id="msg.id">
              <msg-item :msg="msg" />
            </li>
          </template>
        </ul>
      </better-scroll>
      <div
        v-if="newTipsVisible"
        class="c-chat-list__newtips"
        @click="scrollToBottom(true)">查看新消息</div>
    </div>
  </div>
</template>

<script>
import BetterScroll from '../BetterScroll/BetterScrollNew';
import MsgItem from './MsgItem/MsgItem';
import chatMixin from './mixin';
import scrollMixin from './scrollMixin';
import historyMixin from './historyMixin';

export default {
  components: {
    BetterScroll,
    MsgItem
  },

  mixins: [chatMixin, historyMixin, scrollMixin]
};
</script>

<style>
.c-chat-list {
  width: 243px;
  max-height: 150px;
  position: absolute;
  left: 15px;
  bottom: 62px;
  color: #fff;
  z-index: 20;
}
.c-chat-list .c-better-scroll {
  max-height: 150px;
}
.c-chat-list__content {
  margin: 0;
  padding: 0;
  list-style: none;
}
.c-chat-list__wrap {
  position: relative;
}
.c-chat-list__newtips {
  font-size: 14px;
  color: #FFA611;
  height: 24px;
  line-height: 24px;
  background: #fff;
  border-radius: 12px;
  position: absolute;
  left: 0;
  bottom: 0;
  padding: 0 8px;
}
.c-chat-list__content li:last-of-type .c-msg-item {
  margin-bottom: 0;
}
</style>
