<template>
  <div
    class="c-product-item"
    :id="item.productId"
    :data-rank="item.rank">
    <div class="c-product-item__img">
      <img :src="item.cover" />
      <span>{{ number }}</span>
    </div>
    <div class="c-product-item__name g-multiline">{{ item.name }}</div>
    <div class="c-product-item__bottom">
      <span
        class="c-product-item__price"
        :class="{
          'c-product-item__price--free': !item.realPrice
        }">{{ item.realPrice ? `￥${item.realPrice}` : '免费' }}</span>
      <span class="c-product-item__oldprice g-singleline">
        <template v-if="item.price">
          ￥{{ item.price }}
        </template>
      </span>
      <buy-btn :good="item" />
    </div>
  </div>
</template>

<script>
import BuyBtn from '../ProductBuyBtn/ListBtn.vue';

export default {
  props: {
    item: Object,
    number: Number
  },

  components: {
    BuyBtn
  }
};
</script>

<style>
.c-product-item {
  height: 88px;
  display: flex;
  flex-direction: column;
  position: relative;
  padding-left: 98px;
  margin: 0 16px 20px;
}
.c-product-item__img {
  border-radius: 10px;
  width: 88px;
  height: 88px;
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
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
  background: rgba(0, 0, 0, .35);
  text-align: center;
  font-size: 12px;
  border-radius: 0 0 6px 0;
}
.c-product-item__name {
  font-size: 14px;
  color: #fff;
  line-height: 20px;
}
.c-product-item__bottom {
  margin-top: auto;
  width: 100%;
  display: flex;
  align-items: center;
}
.c-product-item__price {
  color: #FF473A;
  font-size: 18px;
  font-weight: bold;
}
.c-product-item__price.c-product-item__price--free {
  font-size: 16px;
}
.c-product-item__oldprice {
  flex: 1;
  color: #ADADC0;
  font-size: 12px;
  text-decoration: line-through;
  margin-left: 4px;
  margin-right: 5px;
}
</style>
