<template>
  <div class="c-product-bubble">
    <product-bubble
      v-if="productSdk"
      animation-type="scale"
      :product-sdk="productSdk"
      :getLinkParams="getLinkParams"
      @click-buy="handleClickBuy"
    />
  </div>
</template>

<script>
import { Product } from '@polyv/interactions-receive-sdk';
import ProductBubble from '@polyv/interactions-receive-sdk-ui-default/lib/ProductBubble';

/** 用于展示推送商品的气泡消息 */
export default {
  components: {
    ProductBubble,
  },

  data() {
    return {
      // 商品库 SDK 实例
      productSdk: null,
    };
  },

  created() {
    this.productSdk = new Product();
  },

  beforeDestroy() {
    this.productSdk && this.productSdk.destroy();
    this.productSdk = null;
  },

  methods: {
    getLinkParams() {
      // 跳转路径上携带参数如： ***.com?customParams1=自定义参数
      // return {
      //   customParams1: '自定义参数'
      // }
      return {};
    },
    handleClickBuy(data) {
      // TODO 用户统计点击商品
      console.info('handleBrowseProduct', data);
    },
  },
};
</script>

<style lang="scss">
.c-product-bubble {
  width: 12px;
  height: 8px;
  margin: 0 auto;
  position: relative;
  z-index: 10;
}
</style>
