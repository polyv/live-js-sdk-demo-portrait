<template>
  <div class="c-product-bubble-btn">
    <div
      v-if="isDisabled"
      class="c-product-bubble-btn__inner c-product-bubble-btn__inner--disabled"></div>
    <div
      class="c-product-bubble-btn__inner"
      ref="wxbtn"
      v-else-if="isWeixinBtn"></div>
    <a
      v-else
      rel="noopener"
      target="_blank"
      class="c-product-bubble-btn__inner"
      :href="btnLink"></a>
  </div>
</template>

<script>
import btnMixin from './mixin';

export default {
  mixins: [btnMixin],

  computed: {
    wxTagHtml() {
      const size = {
        width: '24px',
        height: '24px',
      };
      return this.getBtnHtml(this.good, size);
    },
  }
};
</script>

<style>
.c-product-bubble-btn__inner {
  display: block;
  width: 24px;
  height: 24px;
  text-decoration: none;
  background-image: url(./imgs/icon-bubble.png);
  background-size: contain;
  cursor: pointer;
  outline: none;
}
.c-product-bubble-btn__inner--disabled {
  background-image: url(./imgs/icon-bubble-disabled.png);
}
</style>
