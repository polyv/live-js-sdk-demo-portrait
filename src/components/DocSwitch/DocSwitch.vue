<template>
  <div
    class="c-doc-switch"
    @click="handleSwitchClick">
    <i
      :class="[
        'c-doc-switch__icon',
        iconClass,
        'g-icon'
      ]"></i>
  </div>
</template>

<script>
import channelBaseMixin from '../../assets/mixins/channel-base';

export default {
  mixins: [channelBaseMixin],

  computed: {
    iconClass() {
      return this.documentSwitch ? 'i-doc-hide' : 'i-doc-show';
    }
  },

  methods: {
    handleSwitchClick() {
      this.portrait.$set(this.portrait.portraitState, 'documentSwitch', !this.documentSwitch);
    }
  }
};
</script>

<style>
.c-doc-switch {
  position: absolute;
  top: 0;
  right: 0;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.c-doc-switch__icon {
  width: 28px;
  height: 28px;
  display: inline-block;
}
</style>
