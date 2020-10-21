<template>
  <div>
    <transition
      :name="isGetArrowData ? 'c-product-bubble-anim' : ''"
      @enter="setCloseTime">
      <div
        v-show="bubbleVisible"
        class="c-product-bubble-wrap"
        :style="tipsStyle">
        <div
          class="c-product-bubble"
          :class="{
            'c-product-bubble--visibility': !isGetArrowData
          }">
          <div class="c-product-bubble__img">
            <img :src="goodInfo.cover" />
            <span>{{ goodInfo.showId }}</span>
          </div>

          <p class="c-product-bubble__name g-singleline">{{ goodInfo.name }}</p>

          <div class="c-product-bubble__bottom">
            <div
              class="c-product-bubble__price"
              :class="{
                'c-product-bubble__price--free': !goodInfo.realPrice
              }">{{ goodInfo.realPrice | realPrice }}</div>
            <div class="c-product-bubble__oldprice g-singleline">{{ goodInfo.price | oldPrice }}</div>
            <buy-btn :good="goodInfo" />
          </div>

          <!-- 关闭 -->
          <i class="g-icon i-close-gray" @click="close"></i>
          <!-- 箭头 -->
          <div class="c-product-bubble__arrow"></div>
        </div>
      </div>
    </transition>

    <!-- 用于计算箭头的尺寸 -->
    <div
      v-if="!isGetArrowData"
      ref="tipsArrow"
      class="c-product-bubble__computed"></div>
  </div>
</template>

<script>
import { liveSdk, PolyvLiveSdk } from '../../assets/live-sdk/live-sdk';
import mixin from './mixin';
import BuyBtn from '../ProductBuyBtn/BubbleBtn';

export default {
  mixins: [mixin],

  data() {
    return {
      isGetArrowData: false,
      arrowWidth: 0,
      tipsStyle: {},
    };
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

  methods: {
    // 获取气泡箭头尺寸
    getArrowData() {
      const arrowDom = this.$refs.tipsArrow;
      this.arrowWidth = arrowDom.offsetWidth;
      this.isGetArrowData = true;
    },

    // 计算气泡位置
    setTipsStyle(event, data) {
      const btnDom = document.querySelector('[data-shopping-btn]');
      if (!btnDom) return;
      const { top, left, width } = btnDom.getBoundingClientRect();

      const tipsBottom = document.documentElement.clientHeight - top + 4;
      const tipsLeft = left + ((width - this.arrowWidth) / 2);

      const style = {
        left: `${tipsLeft}px`,
        bottom: `${tipsBottom}px`,
      };
      this.tipsStyle = style;
      this.$nextTick(() => {
        this.handleProductMsg(data);
      });
    },
  },

  mounted() {
    this.$nextTick(() => {
      this.getArrowData();
      liveSdk.on(PolyvLiveSdk.EVENTS.PRODUCT_MESSAGE, this.setTipsStyle);
    });
  },

  beforeDestroy() {
    liveSdk.off(PolyvLiveSdk.EVENTS.PRODUCT_MESSAGE, this.setTipsStyle);
  }
};
</script>

<style>
.c-product-bubble-anim-enter-active,
.c-product-bubble-anim-leave-active {
  opacity: 1;
  transform: scale(1, 1);
  transition: .5s;
}
.c-product-bubble-anim-enter,
.c-product-bubble-anim-leave-active {
  opacity: 0;
  transform: scale(0, 0);
}

.c-product-bubble-wrap {
  width: 12px;
  height: 6px;
  position: absolute;
  transform-origin: center center;
}

.c-product-bubble {
  width: 265px;
  height: 80px;
  border-radius: 10px;
  background: #fff;
  position: absolute;
  bottom: 6px;
  left: -225px;
  z-index: 10;
}

.c-product-bubble--visibility {
  opacity: 0;
}

.c-product-bubble .i-close-gray {
  position: absolute;
  width: 8px;
  height: 8px;
  top: 8px;
  right: 8px;
}

.c-product-bubble__computed,
.c-product-bubble__arrow {
  width: 0;
  height: 0;
  border-color: #fff transparent transparent transparent;
  border-style: solid;
  border-width: 6px;
  position: absolute;
  bottom: -12px;
  right: 28px;
}
.c-product-bubble__computed {
  border-color: transparent !important;
}
.c-product-bubble__img {
  width: 56px;
  height: 56px;
  border-radius: 10px;
  position: absolute;
  top: 50%;
  margin-top: -28px;
  left: 12px;
  overflow: hidden;
}
.c-product-bubble__img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.c-product-bubble__img span {
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
.c-product-bubble__name {
  font-size: 14px;
  color: #333;
  position: absolute;
  top: 14px;
  left: 76px;
  right: 22px;
  line-height: 20px;
  margin: 0;
  padding: 0;
}
.c-product-bubble__bottom {
  position: absolute;
  right: 22px;
  bottom: 12px;
  left: 76px;
  display: flex;
  align-items: center;
}
.c-product-bubble__price {
  color: #FF473A;
  font-size: 18px;
  font-weight: bold;
  margin-right: 4px;
}
.c-product-bubble__price.c-product-bubble__price--free {
  font-size: 16px;
}
.c-product-bubble__oldprice {
  flex: 1;
  color: #ADADC0;
  font-size: 12px;
  text-decoration: line-through;
  margin-right: 5px;
}
</style>
