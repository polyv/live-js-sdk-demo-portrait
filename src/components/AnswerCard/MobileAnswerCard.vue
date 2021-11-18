<!-- @file 答题卡移动端 -->

<template>
  <div>
    <!-- 普通答题 -->
    <popup
      :title="answerCardTitle"
      :visible="isShowAnswerCard"
      v-model="isShowAnswerCard"
      :backable="status === 'isShowAnswer'"
      fit-left-height
      @back="onClickBack"
      @close="onSetAnswerCardVisible(false)"
    >
      <answer-card
        ref="answerCard"
        :answer-card-sdk="answerCardSdk"
        @to-show="onSetAnswerCardVisible(true)"
        @to-hide="onSetAnswerCardVisible(false)"
        @status-changed="onStatusChanged"
      />
    </popup>
  </div>
</template>

<script>
import AnswerCard from '@polyv/interactions-receive-sdk-ui-default/lib/MobileAnswerCard';
import Popup from '../Popup/Popup';
import mixin from './mixin';

export default {
  components: {
    AnswerCard,
    Popup
  },

  mixins: [mixin],

  data() {
    return {
      // 答题卡状态
      status: '',
    };
  },

  computed: {
    answerCardComp() {
      return this.$refs.answerCard;
    },
  },

  methods: {
    onStatusChanged(status) {
      this.status = status;
      if (status === 'isShowQuestion') {
        this.answerCardTitle = '答题卡';
      } else if (status === 'isShowResult') {
        this.answerCardTitle = this.answerCardSdk.curSubmittedAnswer ? '查看结果' : '未作答';
      } else if (status === 'isShowAnswer') {
        this.answerCardTitle = this.answerCardSdk.curSubmittedAnswer ? '查看答案' : '未作答';
      }
    },

    onClickBack() {
      const answerCardComp = this.$refs.answerCard;
      answerCardComp && answerCardComp.backToResult();
    },
  }
};
</script>
