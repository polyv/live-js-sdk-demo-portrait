<template>
  <div class="c-popper">
    <transition name="c-popper-bottom-in">
      <div
        v-show="value"
        v-click-out-side="handleClickOutSide"
        class="c-popper__content"
        :style="contentStyle">
        <div class="c-popper__content__title">
          <div class="c-popper__content__title__text">
            <slot name="title">
              {{ title }}
            </slot>
          </div>
          <i
            class="g-icon i-close"
            @click="close"></i>
        </div>
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script>
import { bus, SWIPER_CHANGE } from '../../assets/utils/event-bus';

export default {
  props: {
    value: Boolean,
    title: String,
    appendBody: {
      type: Boolean,
      default: false
    },
    position: {
      type: String,
      default: 'absolute'
    },
    height: String,
    // 切换轮播屏时是否关闭弹窗
    swiperToClose: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    handleClickOutSide() {
      if (this.value) {
        this.close();
      }
    },
    close() {
      this.$emit('input', false);
    },
    handleSwiperChange() {
      if (this.value) {
        setTimeout(() => {
          this.close();
        }, 300);
      }
    }
  },

  computed: {
    contentStyle() {
      return {
        position: this.position,
        height: this.height || `${document.documentElement.clientHeight * 0.6}px`
      };
    }
  },

  mounted() {
    if (this.appendBody) {
      document.body.appendChild(this.$el);
    }
    if (this.swiperToClose) {
      bus.$on(SWIPER_CHANGE, this.handleSwiperChange);
    }
  },

  beforeDestroy() {
    if (this.appendBody && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
    if (this.swiperToClose) {
      bus.$on(SWIPER_CHANGE, this.handleSwiperChange);
    }
  }
};
</script>

<style>
.c-popper-bottom-in-enter-active,
.c-popper-bottom-in-leave-active {
  opacity: 1;
  margin-bottom: 0;
  transition: margin-bottom 300ms cubic-bezier(0.23, 1, 0.32, 1), opacity 300ms cubic-bezier(0.23, 1, 0.32, 1);
  transform-origin: center bottom;
}
.c-popper-bottom-in-enter,
.c-popper-bottom-in-leave-active {
  opacity: 0;
  margin-bottom: -100%;
}
.c-popper__content {
  border-radius: 10px 10px 0 0;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 100;
  color: #fff;
  padding-top: 20px;
  overflow: hidden;
  background: rgba(0, 0, 0, .88);
  box-sizing: border-box;
}
.c-popper__content__title {
  padding: 0 16px;
  color: #fff;
  font-size: 16px;
  display: flex;
  align-items: center;
}
.c-popper__content__title .i-close {
  width: 14px;
  height: 14px;
  margin-left: auto;
}
</style>
