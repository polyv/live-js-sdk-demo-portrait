<template>
  <div>
    <transition
      name="c-product-bubble-anim"
      @enter="setCloseTime">
      <div
        v-if="bubbleVisible"
        class="c-product-bubble-wrap"
        :style="tipsStyle">
        <div
          class="c-product-bubble"
          :class="{
            'c-product-bubble--finance': goodInfo.productType === 'finance'
          }">
          <div
            v-if="goodInfo.cover"
            class="c-product-bubble__img"
            :class="{
              'c-product-bubble__img--lg': goodInfo.productType === 'finance'
            }">
            <img :src="goodInfo.cover" />
            <span>{{ goodInfo.showId }}</span>
          </div>

          <bubble-finance-info
            v-if="goodInfo.productType === 'finance'"
            :goodInfo="goodInfo" />
          <bubble-normal-info
            v-else
            :goodInfo="goodInfo" />

          <!-- 关闭 -->
          <i class="i-close-gray g-img-cover" @click="close"></i>
        </div>
        <!-- 箭头 -->
        <div class="c-product-bubble__arrow"></div>
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
import BubbleNormalInfo from './BubbleNormalInfo';
import BubbleFinanceInfo from './BubbleFinanceInfo';

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
    BubbleNormalInfo,
    BubbleFinanceInfo,
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
  z-index: 100;
  position: absolute;
  transform-origin: center center;
}

.c-product-bubble {
  width: 265px;
  border-radius: 10px;
  background: #fff;
  position: absolute;
  bottom: 6px;
  left: -225px;
  padding: 12px;
  display: flex;
  box-sizing: border-box;
}
.c-product-bubble--finance {
  width: 308px;
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

.c-product-bubble__arrow {
  bottom: -6px;
  right: 0;
}

.c-product-bubble__computed {
  border-color: transparent;
}

.c-product-bubble__img {
  width: 56px;
  height: 56px;
  border-radius: 10px;
  margin-right: 8px;
  overflow: hidden;
  position: relative;
}
.c-product-bubble__img--lg {
  width: 90px;
  height: 90px;
  border-radius: 4px;
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
</style>
