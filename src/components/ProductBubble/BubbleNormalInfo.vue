<template>
  <div class="c-bubble-normal-info">
    <div class="c-bubble-normal-info__name g-singleline">{{ goodInfo.name }}</div>

    <div class="c-bubble-normal-info__bottom">
      <div
        class="c-bubble-normal-info__price"
        :class="{
          'c-bubble-normal-info__price--free': !goodInfo.realPrice
        }">{{ goodInfo.realPrice | realPrice }}</div>
      <div class="c-bubble-normal-info__oldprice g-singleline">{{ goodInfo.price | oldPrice }}</div>
      <buy-btn :good="goodInfo" />
    </div>
  </div>
</template>

<script>
import BuyBtn from '../ProductBuyBtn/BubbleBtn';

export default {
  props: {
    goodInfo: Object
  },

  components: {
    BuyBtn
  },

  filters: {
    realPrice(price) {
      return price ? `￥${price}` : '免费';
    },

    oldPrice(price) {
      return price ? `￥${price}` : '';
    }
  },
};
</script>

<style>
.c-bubble-normal-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.c-bubble-normal-info__name {
  font-size: 14px;
  color: #333;
  line-height: 20px;
}

.c-bubble-normal-info__bottom {
  margin-top: auto;
  display: flex;
  align-items: center;
}

.c-bubble-normal-info__price {
  color: #FF473A;
  font-size: 18px;
  font-weight: bold;
  margin-right: 4px;
}
.c-bubble-normal-info__price--free {
  font-size: 16px;
}

.c-bubble-normal-info__oldprice {
  flex: 1;
  color: #ADADC0;
  font-size: 12px;
  text-decoration: line-through;
  margin-right: 5px;
}
</style>
