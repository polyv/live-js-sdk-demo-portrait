<template>
  <div class="c-bubble-finance-info">
    <div class="c-bubble-finance-info__name g-singleline">
      <span
        class="c-bubble-finance-info__name__label"
        v-if="!goodInfo.cover">{{ goodInfo.showId }}</span>
      <span>{{ goodInfo.name }}</span>
    </div>

    <div
      v-if="labels.length"
      class="c-bubble-finance-info__labels">
      <finance-label
        class="c-bubble-finance-info__labels__item"
        v-for="(item, index) in labels"
        delay-computed
        :key="index"
        :text="item" />
    </div>

    <div
      v-if="goodInfo.productDesc"
      class="c-bubble-finance-info__desc g-singleline">{{ goodInfo.productDesc }}</div>

    <div class="c-bubble-finance-info__bottom">
      <div class="c-bubble-finance-info__percen">{{ goodInfo.yield }}</div>
      <buy-btn :good="goodInfo" />
    </div>
  </div>
</template>

<script>
import FinanceLabel from '../ProductList/FinanceInfo/FinanceLabel';
import BuyBtn from '../ProductBuyBtn/BubbleBtn';

export default {
  data() {
    return {
      labels: []
    };
  },

  methods: {
    parseFeature() {
      if (!this.goodInfo.features) { return; }
      try {
        this.labels = JSON.parse(this.goodInfo.features).filter((text) => text);
      } catch (e) {
        this.labels = [];
        console.warn(e, this.goodInfo);
      }
    },
  },

  props: {
    goodInfo: Object
  },

  components: {
    FinanceLabel,
    BuyBtn
  },

  mounted() {
    this.parseFeature();
  }
};
</script>

<style>
.c-bubble-finance-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.c-bubble-finance-info__name {
  font-size: 14px;
  color: #333;
  line-height: 20px;
  margin-bottom: 4px;
  overflow: hidden;
}
.c-bubble-finance-info__name__label {
  display: inline-block;
  font-size: 12px;
  height: 16px;
  line-height: 16px;
  min-width: 27px;
  text-align: center;
  padding: 0 3px;
  border-radius: 4px;
  background: rgba(0, 0, 0, .35);
  margin-right: 8px;
  box-sizing: border-box;
  color: #fff;
}

.c-bubble-finance-info__labels {
  display: inline-block;
  white-space: nowrap;
  text-overflow: ellipsis;
  position: relative;
  margin-bottom: 4px;
}
.c-bubble-finance-info__labels__item {
  background: rgba(255, 143, 17, .08);
  border-radius: 4px;
  color: #FF8F11;
  margin-right: 8px;
}

.c-bubble-finance-info__labels__item:last-child {
  margin-right: 0;
}

.c-bubble-finance-info__desc {
  color: #333;
  font-size: 12px;
  opacity: .6;
  line-height: 17px;
}

.c-bubble-finance-info__bottom {
  margin-top: auto;
  display: flex;
  align-items: center;
}

.c-bubble-finance-info__percen {
  color: #FF6666;
  font-size: 18px;
  font-weight: bold;
  margin-right: auto;
}
</style>
