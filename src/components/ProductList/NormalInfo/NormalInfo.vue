<template>
  <div class="c-product-item__normal-info">
    <div class="c-product-item__normal-info__name g-multiline">{{ item.name }}</div>

    <div class="c-product-item__normal-info__bottom">
      <span
        class="c-product-item__normal-info__price"
        :class="{
          'c-product-item__normal-info__price--free': !item.realPrice
        }">{{ item.realPrice ? `￥${item.realPrice}` : '免费' }}</span>
      <span class="c-product-item__normal-info__oldprice g-singleline">
        <template v-if="item.price">
          ￥{{ item.price }}
        </template>
      </span>
      <buy-btn :good="item" />
    </div>
  </div>
</template>

<script>
import BuyBtn from '../../ProductBuyBtn/ListBtn';

export default {
  components: {
    BuyBtn
  },

  props: {
    item: Object,
    number: Number
  }
};
</script>

<style>
.c-product-item__normal-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.c-product-item__normal-info__name {
  font-size: 14px;
  color: #fff;
  line-height: 20px;
}

.c-product-item__normal-info__bottom {
  margin-top: auto;
  width: 100%;
  display: flex;
  align-items: center;
}
.c-product-item__normal-info__price {
  color: #FF473A;
  font-size: 18px;
  font-weight: bold;
}
.c-product-item__normal-info__price--free {
  font-size: 16px;
}
.c-product-item__normal-info__oldprice {
  flex: 1;
  color: #ADADC0;
  font-size: 12px;
  text-decoration: line-through;
  margin-left: 4px;
  margin-right: 5px;
}
</style>
