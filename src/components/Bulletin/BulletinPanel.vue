<template>
  <section-panel
    title="公告"
    class="c-bulletin-panel"
    icon="i-notice-circle"
    v-if="bulletin">
    <div
      class="c-bulletin-panel__content"
      v-html="bulletin"></div>
  </section-panel>
</template>

<script>
import mixin from './mixin';
import SectionPanel from '../SectionPanel/SectionPanel';

export default {
  mixins: [mixin],

  components: {
    SectionPanel
  }
};
</script>

<style>
.c-bulletin-panel {
  margin-bottom: 10px;
}
.c-bulletin-panel__content {
  line-height: 20px;
  font-size: 12px;
  max-height: 160px;
  overflow-y: scroll;
}
</style>
