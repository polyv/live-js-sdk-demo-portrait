<template>
  <div class="c-product-list-btn">
    <div
      v-if="isDisabled"
      class="c-product-list-btn__inner c-product-list-btn__inner--disabled">
      <p class="c-product-list-btn__inner__text">去购买</p>
    </div>
    <div
      class="c-product-list-btn__inner"
      v-else-if="isWeixinBtn">
      <p class="c-product-list-btn__inner__text">去购买</p>
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
      <p class="c-product-list-btn__inner__text">去购买</p>
    </a>
  </div>
</template>

<script>
import btnMixin from './mixin';

export default {
  mixins: [btnMixin],

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
  width: 60px;
  height: 28px;
  line-height: 28px;
  border-radius: 4px;
  text-align: center;
  color: #fff;
  background: #FFA611;
  font-size: 12px;
  cursor: pointer;
  text-decoration: none;
  outline: none;
  position: relative;
}
.c-product-list-btn__inner--disabled {
  background: #CDCDCD;
  cursor: not-allowed;
}
.c-product-list-btn__inner__text {
  width: 60px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  color: #fff;
  font-size: 12px;
  position: absolute;
  top: 0;
  left: 0;
  padding: 0;
  margin: 0;
}
.c-product-list-btn__inner__wxwrap {
  width: 60px;
  height: 28px;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
