import { Lottery } from '@polyv/interactions-receive-sdk';

export default {
  data() {
    return {
      // 抽奖 SDK 实例
      lotterySdk: null,
      // 是否展示结果
      isShowResult: false,
      // 中奖记录数据
      lotteryList: [],
      // 是否展示抽奖盒子
      isLotteryShowing: false,
      // 是否展示抽奖记录
      isShowRecord: false,
      // 抽奖结果内部状态
      lotteryEndStatus: '',
    };
  },
  created() {
    this.lotterySdk = new Lottery();
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
  },
  methods: {
    onLotteryStatusChange(status) {
      if (status === 'running') {
        this.isLotteryShowing = true;
      } else if (status === 'over') {
        this.isLotteryShowing = false;
      }
    },
    onClickBack() {
      this.$refs.lotteryEnd && this.$refs.lotteryEnd.toBack();
    },
    onLotteryShowChange(isShowing) {
      this.isLotteryShowing = isShowing;
    },

    onStatusChanged(lotteryEndStatus) {
      this.lotteryEndStatus = lotteryEndStatus;
    },

    // 展示抽奖结果
    setLotteryResultShow() {
      this.isShowResult = true;
    },

    // 隐藏抽奖结果
    setLotteryResultHide() {
      this.isShowResult = false;
      setTimeout(() => {
        this.$refs.lotteryEnd.toBack();
      }, 600);
    },

    // 切换中奖记录列表组件可见性
    setLotteryRecordVisible() {
      this.isShowRecord = !this.isShowRecord;
      this.getLotteryRecord();
    },

    async getLotteryRecord() {
      try {
        await this.lotterySdk.getLotteryRecord();
      } catch (e) {
        console.error(e);
      }
    },

    // 中奖记录数据更新
    onLotteryRecord(lotteryList = []) {
      // console.warn('中奖记录数据更新', lotteryList);
      if (lotteryList.length) {
        this.lotteryList = lotteryList;
      }
    },

    // 点击查看中奖结果详情
    onClickRecord(record = {}) {
      // console.warn('点击查看中奖结果详情');
      this.isShowRecord = false;
      this.isShowResult = true;
      const { prize, lotteryId, collectInfo, winnerCode, sessionId, received } = record;
      this.$refs.lotteryEnd.setLottery({
        received,
        prize,
        lotteryId,
        collectInfo,
        winnerCode,
        sessionId,
        isWinner: true
      });
    }
  },
  beforeDestroy() {
    if (this.lotterySdk) {
      this.lotterySdk.destroy();
    }
    this.lotterySdk = null;
  },
};
