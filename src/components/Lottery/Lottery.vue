<template>
  <div class="plv-mobile-lottery-default">
    <div class="plv-mobile-lottery-default__lottery-wrap" v-show="isLotteryShowing">
      <div class="plv-mobile-lottery-default__lottery-content">
        <!-- 抽奖中 -->
        <on-lottery
          :lottery-sdk="lotterySdk"
          :pattern="lotteryPattern"
          :delay-time="delayTime"
          @lottery-status-changed="onLotteryStatusChange"
          @is-show-changed="onLotteryShowChange"
        />
      </div>

    </div>

    <!-- 抽奖结果 -->
    <popup
      :visible="isShowResult"
      :title="lotteryEndtitle"
      :modal-style="{
        height: 'auto',
        position: 'absolute',
        bottom: '0',
      }"
      :backable="showBackBtn"
      :close-on-click-modal="false"
      @close="isShowResult = false"
      @back="onClickBack"
    >
      <lottery-end
        ref="lotteryEnd"
        :lottery-sdk="lotterySdk"
        :delay-time="delayTime"
        @to-show="setLotteryResultShow"
        @to-hide="setLotteryResultHide"
        @status-changed="onStatusChanged"
      />
    </popup>
  </div>
</template>

<script>
import mixin from './mixin';
import OnLottery from '@polyv/interactions-receive-sdk-scene-default/lib/MobileOnLottery';
import LotteryEnd from '@polyv/interactions-receive-sdk-scene-default/lib/MobileLotteryEnd';
import Popup from '../Popup/Popup';

export default {
  name: 'LotteryItem',

  components: {
    OnLottery,
    LotteryEnd,
    Popup,
  },

  mixins: [mixin],

  props: {
    pureRtcEnabled: Boolean,
  },

  data() {
    return {
      // 抽奖结果内部状态
      lotteryEndStatus: '',
    };
  },

  computed: {
    lotteryEndtitle() {
      const titles = {
        isShowLotteryEnd: '中奖结果',
        isShowWinnerList: '中奖名单',
        isShowSubmitInfo: '填写联系信息',
      };
      return titles[this.lotteryEndStatus] || titles.isShowLotteryEnd;
    },

    showBackBtn() {
      if (!this.lotteryEndStatus) {
        return false;
      }
      return this.lotteryEndStatus !== 'isShowLotteryEnd';
    },

    delayTime() {
      return this.pureRtcEnabled ? 0 : 3000;
    }
  },

  methods: {
    onClickBack() {
      this.$refs.lotteryEnd && this.$refs.lotteryEnd.toBack();
    },

    onStatusChanged(lotteryEndStatus) {
      this.lotteryEndStatus = lotteryEndStatus;
    },

    toShowRecord() {
      this.isShowRecord = true;
    },

    toHideRecord() {
      this.isShowRecord = false;
    },
  },
};
</script>

<style>
.plv-mobile-lottery-default__lottery-wrap {
  position: absolute;
  z-index: 11;
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 101%;
  top: -1%;
}
.plv-mobile-lottery-default__lottery-wrap .plv-mobile-lottery-default__lottery-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  z-index: 12;
}
</style>
