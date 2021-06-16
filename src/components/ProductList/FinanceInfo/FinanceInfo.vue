<template>
  <div class="c-product-item__finance-info">
    <div
      class="c-product-item__finance-info__name g-singleline">
      <span
        class="c-product-item__finance-info__name__label"
        v-if="!item.cover">{{ number }}</span>
      <span>{{ item.name }}</span>
    </div>

    <div
      v-if="labels.length"
      class="c-product-item__finance-info__labels">
      <finance-label
        class="c-product-item__finance-info__labels__item"
        v-for="(item, index) in labels"
        :key="index"
        :text="item" />
    </div>

    <div
      v-if="item.productDesc"
      class="c-product-item__finance-info__desc g-singleline"
      :class="{
        'c-product-item__finance-info__desc--pr': labels.length
      }">{{ item.productDesc }}</div>

    <div class="c-product-item__finance-info__bottom">
      <div class="c-product-item__finance-info__percen g-singleline">{{ item.yield }}</div>
      <buy-btn
        class="c-product-item__finance-info__btn"
        :text="item.btnShow"
        :good="item" />
    </div>
  </div>
</template>

<script>
import BuyBtn from '../../ProductBuyBtn/ListBtn';
import FinanceLabel from './FinanceLabel';

export default {
  data() {
    return {
      labels: []
    };
  },

  components: {
    FinanceLabel,
    BuyBtn
  },

  props: {
    item: Object,
    number: Number
  },

  methods: {
    parseFeature() {
      if (!this.item.features) { return; }
      try {
        this.labels = JSON.parse(this.item.features).filter((text) => text);
      } catch (e) {
        this.labels = [];
        console.warn(e, this.item);
      }
    }
  },

  mounted() {
    this.parseFeature();
  }
};
</script>

<style>
.c-product-item__finance-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 90px;
}

.c-product-item__finance-info__name {
  color: #fff;
  font-size: 14px;
  line-height: 20px;
  overflow: hidden;
  margin-bottom: 4px;
}
.c-product-item__finance-info__name__label {
  display: inline-block;
  font-size: 12px;
  height: 16px;
  line-height: 16px;
  min-width: 27px;
  text-align: center;
  padding: 0 3px;
  border-radius: 6px;
  background: rgba(255, 255, 255, .35);
  margin-right: 8px;
  box-sizing: border-box;
}

.c-product-item__finance-info__labels {
  display: flex;
  align-items: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-bottom: 4px;
}
.c-product-item__finance-info__labels__item {
  background: rgba(255, 209, 107, .1);
  border-radius: 4px;
  color: #FFD16B;
  margin-right: 8px;
}
.c-product-item__finance-info__labels__item:last-child {
  margin-right: 0;
}

.c-product-item__finance-info__desc {
  font-size: 12px;
  color: #fff;
  opacity: .6;
  line-height: 1.2;
}
.c-product-item__finance-info__desc--pr {
  padding-right: 84px;
}

.c-product-item__finance-info__percen {
  color: #FF6666;
  font-size: 18px;
  font-weight: bold;
  transform: translateY(3px);
  margin-right: 8px;
  line-height: 25px;
}

.c-product-item__finance-info__btn {
  margin-left: auto;
}

.c-product-item__finance-info__bottom {
  margin-top: auto;
  width: 100%;
  display: flex;
  align-items: center;
}
</style>
