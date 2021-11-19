<template>
  <span v-html="parseContent"></span>
</template>

<script>
import { parseEmotions } from '@polyv/emotion-sdk';

export default {
  components: {
  },

  props: {
    msg: Object
  },

  computed: {
    parseContent() {
      return parseEmotions(this.msg.content, 1);
    },
  }
};
</script>

<style lang="scss">
.c-speak-msg {
  font-size: 14px;
  .plv-emotion-img {
    width: 20px;
    height: 20px;
    transform: translateY(-1px);
  }
}
</style>
