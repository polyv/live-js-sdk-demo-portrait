<template>
  <div
    class="c-product-item"
    :id="item.productId"
    :data-rank="item.rank">
    <div
      v-if="item.cover"
      class="c-product-item__img">
      <img :src="item.cover" />
      <span>{{ number }}</span>
    </div>

    <finance-info
      v-if="item.productType === 'finance'"
      :item="item"
      :key="item.features"
      :number="number" />
    <normal-info
      v-else
      :item="item"
      :number="number" />
  </div>
</template>

<script>
import FinanceInfo from './FinanceInfo/FinanceInfo.vue';
import NormalInfo from './NormalInfo/NormalInfo.vue';

export default {
  props: {
    item: Object,
    number: Number
  },

  components: {
    FinanceInfo,
    NormalInfo,
  }
};
</script>

<style>
.c-product-item {
  margin: 0 16px;
  padding-bottom: 14px;
  margin-bottom: 14px;
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, .25);
}
.c-product-item__img {
  width: 87px;
  height: 87px;
  overflow: hidden;
  border-radius: 4px;
  position: relative;
  margin-right: 8px;
  flex-shrink: 0;
}
.c-product-item__img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.c-product-item__img span {
  position: absolute;
  top: 0;
  left: 0;
  width: 27px;
  height: 16px;
  line-height: 16px;
  color: #fff;
  font-size: 12px;
  text-align: center;
  background: rgba(0, 0, 0, .35);
  border-radius: 0 0 4px 0;
}
</style>
