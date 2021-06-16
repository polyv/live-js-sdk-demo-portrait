<template>
  <div class="c-product-list-btn">
    <div
      v-if="isDisabled"
      class="c-product-list-btn__inner c-product-list-btn__inner--disabled">
      <p class="c-product-list-btn__inner__text">{{ text }}</p>
    </div>
    <div
      class="c-product-list-btn__inner"
      v-else-if="isWeixinBtn">
      <p class="c-product-list-btn__inner__text">{{ text }}</p>
      <div
        ref="wxbtn"
        class="c-product-list-btn__inner__wxwrap"></div>
    </div>
    <a
      v-else
      rel="noopener"
      target="_blank"
      class="c-product-list-btn__inner"
      :href="btnLink">
      <p class="c-product-list-btn__inner__text">{{ text }}</p>
    </a>
  </div>
</template>

<script>
import btnMixin from './mixin';

export default {
  mixins: [btnMixin],

  props: {
    text: {
      type: String,
      default: '购买'
    }
  },

  computed: {
    wxTagHtml() {
      const size = {
        width: '60px',
        height: '28px',
      };
      return this.getBtnHtml(this.good, size);
    },
  }
};
</script>

<style>
.c-product-list-btn {
  margin-left: auto;
}
.c-product-list-btn__inner {
  display: block;
  min-width: 72px;
  height: 28px;
  line-height: 28px;
  border-radius: 14px;
  text-align: center;
  background: #FFA611;
  cursor: pointer;
  text-decoration: none;
  overflow: hidden;
  position: relative;
  outline: none;
  padding: 0 12px;
  box-sizing: border-box;
}
.c-product-list-btn__inner--disabled {
  background: #CDCDCD;
  cursor: not-allowed;
}
.c-product-list-btn__inner__text {
  width: inherit;
  height: inherit;
  line-height: inherit;
  text-align: center;
  color: #fff;
  font-size: 12px;
  margin-top: 0;
  margin-bottom: 0;
}
.c-product-list-btn__inner__wxwrap {
  width: 72px;
  height: 28px;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
