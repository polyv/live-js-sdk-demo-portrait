import { getLotterySdk } from './lottery-mixin';

export default {
  data() {
    return {
      /** 抽奖 SDK 实例 */
      lotterySdk: null,
      /** 抽奖进行状态 */
      lotteryStatus: '',
      allLotteryStatus: {},
      lotteryPattern: 'box',
      /** 是否展示结果 */
      isShowResult: false,
      /** 是否展示抽奖盒子 */
      isLotteryShowing: false,
      /** 是否展示抽奖记录 */
      isShowRecord: false,
    };
  },
  created() {
    this.lotterySdk = getLotterySdk();
    this.allLotteryStatus = this.lotterySdk.lotteryStatus;
  },
  methods: {
    onLotteryStatusChange(status) {
      this.lotteryStatus = status;
      if (status === this.allLotteryStatus.running) {
        this.lotteryPattern = 'default';
        this.isShowResult = false;
        this.isShowRecord = false;
        this.isLotteryShowing = true;
      } else if (status === this.allLotteryStatus.over) {
        this.isLotteryShowing = false;
        this.isShowResult = true;
      } else if (status === this.allLotteryStatus.end) {
        this.isLotteryShowing = false;
      }
    },

    onLotteryShowChange(isShowing) {
      this.isLotteryShowing = isShowing;
    },

    // 展示当前弹窗
    showCurrentModal() {
      // 仍在计时/抽奖则展示抽奖盒子
      if ([this.allLotteryStatus.running, this.allLotteryStatus.timing].includes(this.lotteryStatus)) {
        this.isLotteryShowing = true;
      } else {
        this.isShowResult = true;
      }
    },

    // 展示抽奖结果
    setLotteryResultShow() {
      this.isShowResult = true;
    },

    // 隐藏抽奖结果
    setLotteryResultHide() {
      this.isShowResult = false;
      this.$refs.lotteryEnd && this.$refs.lotteryEnd.toBack();
    },

    setLotteryRecordVisible() {
      this.isShowRecord = !this.isShowRecord;
    },

    setLottery(record = {}) {
      this.$refs.lotteryEnd.setLottery(record);
    }
  }
};
