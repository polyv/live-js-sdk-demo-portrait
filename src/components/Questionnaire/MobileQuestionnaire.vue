<template>
  <div>
    <popup
      fit-left-height
      :title="questionnaireTitle"
      :visible="isShowQuestionnaire"
      v-model="isShowQuestionnaire"
      @close="onSetQuestionnaireVisible(false)"
    >
      <questionnaire
        :questionnaire-sdk="questionnaireSdk"
        @status-changed="onStatusChanged"
        @to-show="onSetQuestionnaireVisible(true)"
        @to-hide="onSetQuestionnaireVisible(false)"
      />
    </popup>
  </div>
</template>

<script>
import Questionnaire from '@polyv/interactions-receive-sdk-ui-default/lib/MobileQuestionnarie';
import Popup from '../Popup/Popup';

import mixin from './mixin';

export default {
  components: {
    Questionnaire,
    Popup
  },
  mixins: [mixin],
};
</script>
