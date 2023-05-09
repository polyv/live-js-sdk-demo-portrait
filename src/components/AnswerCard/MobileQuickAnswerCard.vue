<!-- @file 移动端快速问答。由于层级布局与 PC 端快速问答存在较大差异，在此另起组件。 -->

<template>
  <div class="c-quick-answer-card" v-show="isQuickShowAnswerCard">
    <quick-answer-card
      :answer-card-sdk="answerCardSdk"
      @to-show="(e) => onSetQuickAnswerCardVisible(true, e)"
      @to-hide="(e) => onSetQuickAnswerCardVisible(false, e)"
    />
  </div>
</template>

<script>
import mixin from './mixin';
import QuickAnswerCard from '@polyv/interactions-receive-sdk-ui-default/lib/MobileQuickAnswer';

export default {
  components: {
    QuickAnswerCard,
  },

  mixins: [mixin],
};
</script>
<style>
.c-quick-answer-card {
  position: absolute;
  top: 12px;
  left: 0;
  z-index: 31 !important;
  width: 100%;
  background: #fff;
  -webkit-box-shadow: 0 2px 4px rgb(0 0 0 / 4%);
  box-shadow: 0 2px 4px rgb(0 0 0 / 4%);
}
.c-quick-answer-card .plv-iar-quick-answer-default__btn {
  position: absolute;
  top: 50%;
  margin-top: -16px;
  right: 48px;
  width: 72px;
  height: 32px;
  line-height: 32px;
  padding: 0;
  text-align: center;
  font-size: 14px;
  border-radius: 25px;
  transition: all .15s ease-in;
  white-space: nowrap;
}
</style>
