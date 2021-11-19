import { Questionnaire } from '@polyv/interactions-receive-sdk';

const AllStatus = {
  isShowQuestion: 'isShowQuestion',
  isShowResult: 'isShowResult',
  isShowAnswer: 'isShowAnswer',
};

export default {
  data() {
    return {
      // 问卷 SDK 实例
      questionnaireSdk: null,
      // 是否展示问卷
      isShowQuestionnaire: false,
      // 弹窗状态
      currentStatus: ''
    };
  },
  computed: {
    questionnaireTitle({ currentStatus }) {
      let title = '';
      if (currentStatus === AllStatus.isShowQuestion) {
        title = '问卷';
      } else if (currentStatus === AllStatus.isShowResult) {
        title = '问卷结果';
      } else if (currentStatus === AllStatus.isShowAnswer) {
        title = '问卷结果';
      }
      return title;
    }
  },
  created() {
    this.questionnaireSdk = new Questionnaire();
  },
  methods: {
    onStatusChanged(status) {
      this.currentStatus = status;
    },

    onSetQuestionnaireVisible(visible) {
      this.isShowQuestionnaire = visible;
    }
  }
};
