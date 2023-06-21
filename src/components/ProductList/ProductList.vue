<template>
  <popper
    class="c-product-popper"
    swiper-to-close
    v-model="shoppingVisible">
    <div slot="title" class="c-product-popper__title">
      <i class="i-shopping g-img-cover"></i>
      <span>
        共
        <span class="c-product-popper__title__number"> {{ total }} </span>
        件商品
      </span>
    </div>
    <div class="c-product-list__wrap">
      <product-list
        class="c-product-list"
        v-if="productSdk"
        :product-sdk="productSdk"
        :totalVisible="false"
        @total-change="num => (total = num)"
        @browse-product="handleBrowseProduct"
        @click-buy="handleClickBuy"
      />
    </div>
  </popper>
</template>

<script>
import { Product } from '@polyv/interactions-receive-sdk';
import ProductList from '@polyv/interactions-receive-sdk-ui-default/lib/MobileProduct';
import { SHOPPING_VISIBLE, bus } from '../../assets/utils/event-bus';
import Popper from '../Popper/Popper.vue';

export default {
  components: {
    Popper,
    ProductList
  },

  data() {
    return {
      // 商品库弹窗是否可见
      shoppingVisible: false,
      // 商品库 SDK 实例
      productSdk: null,
      // 商品总数
      total: 0
    };
  },

  created() {
    this.bindEvts();
    this.productSdk = new Product();
    this.productSdk.on(this.productSdk.events.PRODUCT_MESSAGE, msg => {
      const ProductMessageStatus = this.productSdk.ProductMessageStatus;
      const status = `${msg.status}`;
      if (status === ProductMessageStatus.ProductSwitch) {
        this.$emit('change-switch', msg.content.enabled);
      }
    });
  },

  beforeDestroy() {
    this.productSdk && this.productSdk.destroy();
    this.productSdk = null;
    this.unbindEvts();
  },

  methods: {
    bindEvts() {
      bus.$on(SHOPPING_VISIBLE, this.onShoppingVisible);
    },
    unbindEvts() {
      bus.$off(SHOPPING_VISIBLE, this.onShoppingVisible);
    },
    onShoppingVisible(shoppingVisible) {
      this.shoppingVisible = shoppingVisible;
    },
    handleBrowseProduct(data) {
      // TODO 用于统计用户数据
      console.info('handleBrowseProduct', data);
    },
    handleClickBuy(data) {
      // TODO 用户统计点击商品
      console.info('handleBrowseProduct', data);
    }
  }
};
</script>

<style lang="scss">
.c-product-popper .c-popper__content {
  padding-top: 54px;
  background: #262523;
}
.c-product-popper .c-popper__content .c-popper__content__title {
  position: absolute;
  top: 0;
  width: 100%;
  height: 54px;
  line-height: 54px;
}
.c-product-popper .c-popper__content__title .i-close {
  margin-right: 32px;
}

.c-product-popper__title {
  display: flex;
  align-items: center;
  font-size: 12px;
}
.c-product-popper__title .i-shopping {
  width: 12px;
  height: 12px;
  margin-right: 5px;
  display: inline-block;
}
.c-product-popper__title .c-product-popper__title__number {
  color: #ff9911;
}

.c-product-list__wrap {
  height: 100%;
  width: 100%;
}
.c-product-list {
  background: none;
}
.c-product-list .plv-iar-product__content {
  background-color: unset;
  color: inherit;
}
</style>
