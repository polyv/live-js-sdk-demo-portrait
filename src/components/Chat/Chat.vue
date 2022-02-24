<template>
  <div
    data-player-click
    class="c-chat g-iphone-x-pb">
    <div
      data-player-click
      class="c-chat__content">
      <!-- 欢迎语 -->
      <welcome v-if="!isPlaybacking" />
      <!-- 打赏动效 -->
      <donate-tips v-if="!isPlaybacking" />
      <!-- 打赏动效 -->
      <donate-animation v-if="donateAnimationSwitch"/>
      <!-- 聊天室 -->
      <chat-list
        :style="chatListStyle"
        :channel="channel" />

      <div class="c-chat__control">
        <!-- 进度条 -->
        <div
          v-if="progressBarVisible"
          class="c-chat_control__progress-bar__wrap"
          :class="{
            'c-chat_control__progress-bar__wrap--left': !progressBarIsBlock
          }">
          <progress-bar :playerCtrl="playerCtrl" />
        </div>

        <!-- 输入提示 -->
        <template v-if="!closedRoom">
          <div
            v-if="sendMsgBtnVisible"
            class="c-chat__control__btn">
            <div
              class="c-chat__control__btn__inner g-icon i-send-msg"
              @click="handleClickSendMsg"></div>
          </div>
          <input-tips
            v-else
            @click.native="handleClickSendMsg" />
        </template>

        <!-- 章节开关 -->
        <div
          v-if="chapterVisible"
          class="c-chat__control__btn">
          <div
            class="c-chat__control__btn__inner g-icon i-playback"
            @click="showChapterList"></div>
        </div>

        <!-- 右侧按钮 -->
        <div class="c-chat__control__right">
          <!-- 购物车入口 -->
          <div
            v-if="productEnabled"
            class="c-chat__control__btn">
            <div
              data-shopping-btn
              class="c-chat__control__btn__inner g-icon i-shop-car"
              @click="showProductList"></div>
          </div>
          <!-- 打赏入口 -->
          <div
            v-if="donateGoodEnabled"
            class="c-chat__control__btn">
            <div
              data-shopping-btn
              class="c-chat__control__btn__inner g-icon i-donate"
              @click="showDonate"></div>
          </div>
          <!-- 更多&点赞 -->
          <div
            v-if="likeVisible || playerMenuBarVisible"
            class="c-chat__control__btn">
            <!-- 点赞 -->
            <like
              v-if="likeVisible"
              class="c-chat__control__btn__inner--like"
              :seatType="!playerMenuBarVisible ? 'deviation' : ''"
              :channel="channel" />
            <!-- 更多 -->
            <div
              class="c-chat__control__btn__inner c-chat__control__btn__inner--more g-icon i-more"
              @click="showPlayerSetting"></div>
          </div>
        </div>
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
  CHAT_INPUT_VISIBLE,
  CHAPTER_VISIBLE,
  UPDATE_DONATE_ANIMATION,
} from '../../assets/utils/event-bus';
import channelBaseMixin from '../../assets/mixins/channel-base';
import InputTips from '../Form/InputTips';
import DonateTips from '../Donate/DonateTips';
import Welcome from '../Welcome/Welcome';
import ChatList from '../ChatList/ChatList';
import MsgInput from '../Form/MsgInput';
import Like from '../Like/Like';
import ProgressBar from '../ProgressBar/ProgressBar';
import DonateAnimation from '../DonateAnimation/MobileDonateAnimation.vue';

export default {
  data() {
    return {
      donateAnimationSwitch: true,
    };
  },
  mixins: [channelBaseMixin],

  components: {
    InputTips,
    DonateTips,
    Welcome,
    ChatList,
    MsgInput,
    Like,
    ProgressBar,
    DonateAnimation,
  },

  props: {
    playerCtrl: Object
  },

  methods: {
    handleClickSendMsg() {
      if (this.closedRoom) return;
      bus.$emit(CHAT_INPUT_VISIBLE, true);
    },
    showDonate() {
      bus.$emit(DONATE_VISIABLE, true);
    },
    showProductList() {
      bus.$emit(SHOPPING_VISIBLE, true);
    },
    showPlayerSetting() {
      bus.$emit(PLAYER_SETTING_VISIBLE, true);
    },
    showChapterList() {
      bus.$emit(CHAPTER_VISIBLE, true);
    },
    setDonateAnimation(donateAnimationSwitch) {
      this.donateAnimationSwitch = donateAnimationSwitch;
    },
  },
  created() {
    bus.$on(UPDATE_DONATE_ANIMATION, this.setDonateAnimation);
  },
  beforeDestroy() {
    bus.off(UPDATE_DONATE_ANIMATION, this.setDonateAnimation);
  },
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
  align-items: flex-end;
  flex-wrap: wrap;
  z-index: 10;
}
.c-chat__control__right {
  margin-left: auto;
  display: flex;
  align-items: flex-end;
  z-index: 11;
}
.c-chat__control__btn + .c-chat__control__btn {
  margin-left: 16px;
}
.c-chat__control__btn__inner {
  width: 32px;
  height: 32px;
}
.c-chat__control__btn__inner--like + .c-chat__control__btn__inner--more {
  margin-top: 16px;
}
.c-chat_control__progress-bar__wrap {
  width: 100%;
  margin-bottom: 10px;
}
.c-chat_control__progress-bar__wrap.c-chat_control__progress-bar__wrap--left {
  width: auto;
  flex: 1;
  margin-right: 12px;
  margin-bottom: 0;
}
.c-chat_control__progress-bar__wrap.c-chat_control__progress-bar__wrap--left .c-progress-bar__btn {
  margin-right: 12px;
}
</style>
