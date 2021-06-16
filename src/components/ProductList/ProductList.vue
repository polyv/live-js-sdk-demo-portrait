<template>
  <popper
    swiper-to-close
    class="c-product"
    v-model="visible"
    height="400px">
    <div
      slot="title"
      class="c-product__title">
      <i class="g-icon i-shopping"></i>
      <span>共<font color="#FF9911"> {{ total }} </font>件商品</span>
    </div>
    <div
      class="c-product__wrap"
      v-if="products.length"
      ref="productWrap"
      @scroll="handleScroll">
      <template v-for="(item, index) in products">
        <product-item
          :key="item.productId"
          :number="total - index"
          :item="item" />
      </template>
    </div>

    <div
      v-else
      class="c-product__empty">
      <img src="./imgs/product-empty.png" class="c-product__empty__img" />
      <span>宝贝还没上架，敬请期待</span>
    </div>
  </popper>
</template>

<script>
import { liveSdk, PolyvLiveSdk } from '../../assets/live-sdk/live-sdk';
import { SHOPPING_VISIBLE, bus } from '../../assets/utils/event-bus';
import Popper from '../Popper/Popper';
import mixin from './mixin';
import ProductItem from './ProductItem';

export default {
  data() {
    return {
      visible: false
    };
  },

  mixins: [mixin],

  components: {
    Popper,
    ProductItem,
  },

  methods: {
    async handleVisible(visible) {
      if (visible) {
        await this.init();
      }
      this.visible = visible;
    },
    handleSocketMsg(event, data) {
      this.visible && this.handleProductMsg(data);
    }
  },

  mounted() {
    bus.$on(SHOPPING_VISIBLE, this.handleVisible);
    liveSdk.on(PolyvLiveSdk.EVENTS.PRODUCT_MESSAGE, this.handleSocketMsg);
  },

  beforeDestroy() {
    bus.$off(SHOPPING_VISIBLE, this.handleVisible);
    liveSdk.off(PolyvLiveSdk.EVENTS.PRODUCT_MESSAGE, this.handleSocketMsg);
  }
};
</script>

<style>
.c-product__title {
  display: flex;
  align-items: center;
  font-size: 12px;
}
.c-product__title .i-shopping {
  width: 12px;
  height: 12px;
  margin-right: 5px;
}
.c-product__empty {
  position: absolute;
  top: 55px;
  bottom: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: rgba(255, 255, 255, .6);
  font-size: 14px;
}
.c-product__empty__img {
  width: 88px;
  height: 88px;
  margin-bottom: 8px;
  object-fit: cover;
}
.c-product__wrap {
  position: absolute;
  top: 55px;
  bottom: 0;
  width: 100%;
  overflow-y: auto;
}
</style>
