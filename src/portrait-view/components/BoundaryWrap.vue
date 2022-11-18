<template>
  <div
    class="c-watch__boundary-wrap"
    :class="{
      'c-watch__boundary-wrap--right': seat === 'right'
    }"
    :style="style">
    <slot></slot>
  </div>
</template>

<script>
import channelBaseMixin from '../../assets/mixins/channel-base';

export default {
  props: {
    seat: String
  },

  mixins: [channelBaseMixin],

  computed: {
    style() {
      return {
        height: `${this.portraitHeight}px`
      };
    }
  }
};
</script>

<style>
.c-watch__boundary-wrap {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  z-index: 30;
}
.c-watch__boundary-wrap.c-watch__boundary-wrap--right {
  left: initial;
  right: 0;
}
</style>
