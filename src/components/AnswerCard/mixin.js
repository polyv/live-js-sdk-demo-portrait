import { getAnswerCardSdk } from './answer-card';
export default {
  data() {
    return {
      // 答题卡 SDK 实例
      answerCardSdk: getAnswerCardSdk(),
      // 是否展示答题卡
      isShowAnswerCard: false,
      // 答题卡标题
      answerCardTitle: '',
      // 是否展示快速答题
      isQuickShowAnswerCard: false,
      // 快速问答类型
      quickAnswerCardType: '',
    };
  },

  computed: {
    // 快速问答弹窗标题
    quickAnswerCardTitle() {
      return this.quickAnswerCardType === this.answerCardSdk.questionTypes.CheckBox ?
        '【多选】' :
        '【单选】';
    }
  },

  beforeDestroy() {
    this.destroy();
  },

  methods: {
    onSetAnswerCardVisible(isShowAnswerCard) {
      this.isShowAnswerCard = isShowAnswerCard;
    },

    onSetQuickAnswerCardVisible(isQuickShowAnswerCard, question) {
      this.isQuickShowAnswerCard = isQuickShowAnswerCard;
      if (question) {
        this.quickAnswerCardType = question.type;
      }
    },

    destroy() {
      this.answerCardSdk && this.answerCardSdk.destroy();
      this.answerCardSdk = null;
    },
  },
};
