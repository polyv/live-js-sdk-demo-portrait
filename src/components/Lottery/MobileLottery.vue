<template>
  <div class="plv-mobile-lottery-default">
    <!-- 中奖记录查看入口挂件 -->
    <div class="plv-mobile-lottery_record-wrap" v-if="lotteryList && lotteryList.length >= 1" @click="setLotteryRecordVisible">
      <div class="plv-mobile-lottery_record_img">
        <span></span>
      </div>
      <div class="plv-mobile-lottery_record_text">中奖记录</div>
    </div>

    <div class="plv-mobile-lottery-default__lottery-wrap" v-show="isLotteryShowing">
      <div class="plv-mobile-lottery-default__lottery-content">
        <!-- 抽奖中 -->
        <on-lottery
          v-if="lotterySdk"
          v-show="isLotteryShowing"
          :delay-time="2000"
          :lottery-sdk="lotterySdk"
          @lottery-status-changed="onLotteryStatusChange"
          @is-show-changed="onLotteryShowChange"
        />
      </div>
    </div>

    <!-- 中奖记录 -->
    <Popup
      :title="lotteryEndtitle"
      :visible="isShowRecord"
      v-model="isShowRecord"
      @close="isShowRecord = false"
    >
      <lottery-record
        v-if="lotterySdk"
        :lottery-sdk="lotterySdk"
        :delay-time="1000"
        @lottery-list="onLotteryRecord"
        @submit-info="onClickRecord"
        @check-info="onClickRecord"
      />
    </Popup>

    <!-- 中奖结果 -->
    <!-- Popup是一个弹窗组件，可根据界面风格自行设计-->
    <Popup
      :title="lotteryEndtitle"
      :has-back-btn="showBackBtn"
      :visible="isShowResult"
      v-model="isShowResult"
      @close="setLotteryResultHide"
      @back="onClickBack"
    >
      <lottery-end
        v-if="lotterySdk"
        ref="lotteryEnd"
        :delay-time="3000"
        :lottery-sdk="lotterySdk"
        :lottery-list="lotteryList"
        @to-show="setLotteryResultShow"
        @to-hide="setLotteryResultHide"
        @status-changed="onStatusChanged"
      />
    </Popup>
  </div>
</template>

<script>
import OnLottery from '@polyv/interactions-receive-sdk-ui-default/lib/MobileOnLottery';
import LotteryEnd from '@polyv/interactions-receive-sdk-ui-default/lib/MobileLotteryEnd';
import LotteryRecord from '@polyv/interactions-receive-sdk-ui-default/lib/MobileLotteryRecord';
import Popup from '../Popup/Popup';

import mixin from './mixin';

export default {
  components: {
    OnLottery,
    LotteryEnd,
    LotteryRecord,
    Popup,
  },
  mixins: [mixin],
};
</script>

<style>
.plv-mobile-lottery-default__lottery-wrap {
  position: absolute;
  z-index: 12;
  background-color: rgba(0,0,0,.5);
  width: 100%;
  height: 101%;
  top: -1%;
}
.plv-mobile-lottery-default__lottery-content {
  position: absolute;
  bottom: 100px;
  left: 50%;
  -webkit-transform: translateX(-50%);
  -ms-transform: translateX(-50%);
  transform: translateX(-50%);
  z-index: 13;
}
.plv-mobile-lottery_record-wrap {
  position: fixed;
  bottom: 135px;
  right: 16px;
  z-index: 12;
  cursor: pointer;
}
.plv-mobile-lottery_record_img {
  text-align: right;
}
.plv-mobile-lottery_record_img span{
  display: inline-block;
  width: 32px;
  height: 32px;
  background-size: 100% 100%;
  background-image: url('./imgs/lotter_record.png');
}
.plv-mobile-lottery_record_text {
  color: #fff;
  font-size: 12px;
}
</style>
