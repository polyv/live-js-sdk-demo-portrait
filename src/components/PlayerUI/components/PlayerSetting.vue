<template>
  <popper
    swiper-to-close
    class="c-player-setting"
    :title="popperTitle"
    v-model="visible">
    <!-- 菜单栏 -->
    <ul
      v-if="settingModel === 'menu'"
      class="c-player-setting__content">
      <!-- 只看主持人/查看全部 -->
      <div
        class="c-player-setting__content__item"
        @click="handleClickOnlyHost">
        <i
          :class="[
            'c-player-setting__content__item__icon',
            'g-icon',
            onlyHostIcon]"></i>
        <span class="c-player-setting__content__item__text">{{ onlyHostText }}</span>
      </div>
      <!-- 显示打赏动效 -->
      <div
        v-if="donateEnabled && donateAnimationSwitch"
        class="c-player-setting__content__item"
        @click="handleDonateAnimation">
        <i
          :class="[
            'c-player-setting__content__item__icon',
            'g-icon',
            'i-donate-show']"></i>
        <span class="c-player-setting__content__item__text">展示特效</span>
      </div>
      <!-- 隐藏打赏动效 -->
      <div
        v-if="donateEnabled && !donateAnimationSwitch"
        class="c-player-setting__content__item"
        @click="handleDonateAnimation">
        <i
          :class="[
            'c-player-setting__content__item__icon',
            'g-icon',
            'i-donate-hide']"></i>
        <span class="c-player-setting__content__item__text">屏蔽特效</span>
      </div>
      <!-- 播放模式 -->
      <div
        v-if="setPlayModeVisible"
        class="c-player-setting__content__item"
        @click="handleChangeMode">
        <i
          :class="[
            'g-icon',
            'c-player-setting__content__item__icon',
            modeStyle.icon
          ]"></i>
        <span class="c-player-setting__content__item__text">{{ modeStyle.text }}</span>
      </div>
      <!-- 清晰度 -->
      <div
        v-if="setMultirateVisible"
        class="c-player-setting__content__item"
        @click="handleClickMultirate">
        <i class="c-player-setting__content__item__icon g-icon i-definition"></i>
        <span class="c-player-setting__content__item__text">切换清晰度</span>
      </div>
      <!-- 倍速设置 -->
      <div
        v-if="setRateVisible"
        class="c-player-setting__content__item"
        @click="handleClickRate">
        <i class="c-player-setting__content__item__icon g-icon i-rate"></i>
        <span class="c-player-setting__content__item__text">切换倍速</span>
      </div>
      <!-- 举报投诉 -->
      <div
        v-if="watchFeedbackEnabled"
        class="c-player-setting__content__item"
        @click="handleClickFeedBack">
        <i
          :class="[
            'c-player-setting__content__item__icon',
            'g-icon',
            'i-feed']"></i>
        <span class="c-player-setting__content__item__text">举报投诉</span>
      </div>
    </ul>

    <!-- 清晰度选择 -->
    <setting-select
      v-if="settingModel === 'multirate' && setMultirateVisible"
      :active="currentDefinition"
      :list="definitions"
      @change="handleChangeMultirate($event.value)" />

    <!-- 倍数选择 -->
    <setting-select
      v-if="settingModel === 'rate' && setRateVisible"
      :active="currentRate"
      :list="rateList"
      class="c-player-setting--rate"
      @change="handleChangeRate($event.value)" />

  </popper>
</template>

<script>
import { PLAYER_SETTING_VISIBLE, ONLY_HOST, FEED_BACK_VISIBLE, bus } from '../../../assets/utils/event-bus';
import Popper from '../../Popper/Popper';
import channelBaseMixin from '../../../assets/mixins/channel-base';
import SettingSelect from './setting-select';

export default {
  mixins: [channelBaseMixin],

  data() {
    return {
      visible: false,
      settingModel: 'menu',
      rateList: [
        { name: '0.5x', value: 0.5 },
        { name: '1.0x', value: 1 },
        { name: '1.25x', value: 1.25 },
        { name: '1.5x', value: 1.5 },
        { name: '2.0x', value: 2.0 },
      ],
      onlyHost: false,
      donateAnimationSwitch: false, // 默认关闭打赏动效
    };
  },

  components: {
    Popper,
    SettingSelect
  },

  props: {
    channel: Object
  },

  computed: {
    popperTitle() {
      if (this.settingModel === 'multirate') return '切换清晰度';
      return '';
    },
    modeStyle() {
      return {
        icon: this.playerMode === 'video' ? 'i-audio' : 'i-video',
        text: this.playerMode === 'video' ? '音频模式' : '视频模式'
      };
    },
    onlyHostIcon() {
      return this.onlyHost ? 'i-show-all' : 'i-only-host';
    },
    onlyHostText() {
      return this.onlyHost ? '查看全部' : '只看主持';
    },
    // 现金/道具/积分打赏开启
    donateEnabled() {
      const donateSetting = this.channelData?.donateSetting;
      const donateCashEnabled = this.ynToBool(donateSetting?.donateCashEnabled || 'N');
      const donateGoodEnabled = this.ynToBool(donateSetting?.donateGoodEnabled || 'N');
      // 微信公众号相关功能开启，且现金/道具打赏开启
      const weixinDonateEnabled =
        this.ynToBool(this.channelData?.userConfig?.weixinAccountFunctionEnabled || 'Y') &&
        (donateCashEnabled ||
          donateGoodEnabled);
      const donatePointEnabled = this.ynToBool(donateSetting?.donatePointEnabled || 'N');

      return (weixinDonateEnabled || donatePointEnabled) && !this.isSeminar;
    },

    // 打赏特效屏蔽是否显示，道具打赏开启
    donateAnimationSwitchVisible() {
      const donateSetting = this.channelData?.donateSetting;
      const donateGoodEnabled = this.ynToBool(donateSetting.donateGoodEnabled);
      const donatePointEnabled = this.ynToBool(donateSetting.donatePointEnabled);

      return (donateGoodEnabled || donatePointEnabled);
    },

    watchFeedbackEnabled() {
      return this.ynToBool(this.channelData.watchFeedbackEnabled || 'N');
    }
  },

  methods: {
    // 屏蔽/展示特效
    handleDonateAnimation() {
      this.donateAnimationSwitch = !this.donateAnimationSwitch;
      bus.$emit('UPDATE_DONATE_ANIMATION', !this.donateAnimationSwitch);
    },
    handleVisible(visible, { type = 'menu' } = {}) {
      this.settingModel = type;
      this.visible = visible;
    },
    handleClickMultirate() {
      this.settingModel = 'multirate';
    },
    handleClickRate() {
      this.settingModel = 'rate';
    },
    handleChangeMultirate(definition) {
      if (definition === this.currentDefinition) { return; }
      this.getPlayerCtrl().changeDefinition(definition);
    },
    handleChangeMode() {
      const mode = this.playerMode === 'video' ? 'audio' : 'video';
      this.getPlayerCtrl().setPlayerMode(mode);
      this.visible = false;
    },
    handleChangeRate(rate) {
      if (rate === this.currentRate) { return; }
      this.getPlayerCtrl().changeRate(rate);
    },
    handleClickOnlyHost() {
      this.visible = false;
      if (this.onlyHost) {
        this.onlyHost = false;
      } else {
        this.onlyHost = true;
      }
      bus.$emit(ONLY_HOST, this.onlyHost);
    },
    handleClickFeedBack() {
      this.visible = false;
      bus.$emit(FEED_BACK_VISIBLE, true);
    },
  },

  mounted() {
    bus.$on(PLAYER_SETTING_VISIBLE, this.handleVisible);
  },
  beforeDestroy() {
    bus.$off(PLAYER_SETTING_VISIBLE, this.handleVisible);
  }
};
</script>

<style>
.c-player-setting__content {
  padding: 10px 0 30px;
  margin: 0;
}
.c-player-setting__content__item {
  display: inline-flex;
  width: 72px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.c-player-setting__content__item__icon {
  width: 32px;
  height: 32px;
  margin-bottom: 10px;
}
.c-player-setting__content__item__text {
  color: #CDCDCD;
  font-size: 12px;
}
.c-player-setting--rate {
  display: flex;
  justify-content: space-between;
}
.c-player-setting--rate .c-setting-select__btn {
  margin-left: 10px;
  margin-right: 10px;
}
</style>
