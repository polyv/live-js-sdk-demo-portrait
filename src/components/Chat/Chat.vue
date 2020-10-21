<template>
  <div
    data-player-click
    class="c-chat g-iphone-x-pb">
    <div
      data-player-click
      class="c-chat__content">
      <!-- 欢迎语 -->
      <welcome />
      <!-- 打赏动效 -->
      <donate-tips />
      <!-- 聊天室 -->
      <chat-list :channel="channel" />
      <!-- 点赞 -->
      <like
        :seatType="!playerMenuBarVisible ? 'deviation' : ''"
        :channel="channel" />

      <div
        :class="[
          'c-chat__control',
          !playerMenuBarVisible ? 'c-chat__control--nomenu' : ''
        ]">
        <!-- 输入提示 -->
        <input-tips />
        <!-- 购物车入口 -->
        <div
          v-if="productEnabled"
          data-shopping-btn
          class="c-chat__control__btn g-icon i-shop-car"
          @click="showProductList"></div>
        <!-- 打赏入口 -->
        <div
          v-if="donateGoodEnabled"
          class="c-chat__control__btn g-icon i-donate"
          @click="showDonate"></div>
        <!-- 更多 -->
        <div
          v-if="playerMenuBarVisible"
          class="c-chat__control__btn g-icon i-more"
          @click="showPlayerSetting"></div>
      </div>

      <!-- 输入留言 -->
      <msg-input />
    </div>
  </div>
</template>

<script>
import {
  bus,
  DONATE_VISIABLE,
  SHOPPING_VISIBLE,
  PLAYER_SETTING_VISIBLE,
} from '../../assets/utils/event-bus';
import channelBaseMixin from '../../assets/mixins/channel-base';
import playerCommonMixin from '../../assets/mixins/player-common';
import InputTips from '../Form/InputTips';
import DonateTips from '../Donate/DonateTips';
import Welcome from '../Welcome/Welcome';
import ChatList from '../ChatList/ChatList';
import MsgInput from '../Form/MsgInput';
import Like from '../Like/Like';

export default {
  mixins: [channelBaseMixin, playerCommonMixin],

  components: {
    InputTips,
    DonateTips,
    Welcome,
    ChatList,
    MsgInput,
    Like,
  },

  methods: {
    showDonate() {
      bus.$emit(DONATE_VISIABLE, true);
    },
    showProductList() {
      bus.$emit(SHOPPING_VISIBLE, true);
    },
    showPlayerSetting() {
      bus.$emit(PLAYER_SETTING_VISIBLE, true);
    },
  }
};
</script>

<style>
.c-chat {
  position: absolute;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  z-index: 10;
}
.c-chat__content {
  height: 100%;
  position: relative;
}
.c-chat__control {
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 16px;
  display: flex;
  align-items: center;
}
.c-chat__control.c-chat__control--nomenu {
  right: 64px;
}
.c-chat__control .c-input-tips {
  margin-right: auto;
}
.c-chat__control__btn {
  width: 32px;
  height: 32px;
  margin-left: 16px;
}
</style>
