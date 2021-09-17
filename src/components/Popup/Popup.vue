<template>
  <div
    ref="popup"
    v-show="visible"
    class="c-popup"
    :class="{ 'c-popup--fullscreen': fullScreen }"
  >
    <transition name="fade" @after-enter="$emit('opened')">
      <div v-show="show" class="c-popup__bg" @click="handleClose"></div>
    </transition>
    <transition name="slide" @after-leave="afterLeave">
      <div
        ref="popupContent"
        v-show="show"
        class="c-popup-content"
        :style="popupContentStyle"
      >
        <div ref="customHeader" class="c-popup__custom-header">
          <slot name="header" :popupMethods="{ handleClose, handleConfirm }"></slot>
        </div>
        <div v-if="showHeader" class="c-popup__header">
          <span
            v-if="closable"
            class="c-popup-btn c-popup-btn__close i-close-mob"
            @click="handleClose"
          ></span>
          <span
            v-if="backable"
            class="c-popup-btn c-popup-btn__back i-back"
            @click="handleBack"
          ></span>
          <h2>{{ title }}</h2>
        </div>
        <div class="c-popup-body" :style="bodyStyle">
          <slot></slot>
        </div>
        <div class="c-popup-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    fullScreen: Boolean, // 满屏(如电话国际区号选择)
    fitLeftHeight: Boolean, // 占满除播放器以外高度
    showHeader: {
      type: Boolean,
      default: true,
    },
    appendToBody: {
      type: Boolean,
      default: false,
    },
    visible: {
      type: Boolean,
      default: true,
    },
    closable: {
      type: Boolean,
      default: true,
    },
    backable: {
      type: Boolean,
      default: false,
    },
    closeOnClickModal: {
      type: Boolean,
      default: false,
    },
    contentStyle: {
      type: Object,
    },
    bodyStyle: {
      type: Object,
    },
    defaultDpi: {
      type: Boolean,
      default: true,
    },
  },

  watch: {
    visible: {
      immediate: true,
      handler(newVal) {
        this.show = newVal;
        this.$nextTick(() => {
          this.setHeight();
          this.setHeaderHeight();
        });
      },
    },
  },

  computed: {
    popupContentStyle() {
      let style = {
        height: this.height,
        paddingTop: this.headerHeight,
      };

      // 如果存在自定义header，则不设置圆角
      if (!this.showHeader) {
        style.borderRadius = 'unset';
      }
      style = Object.assign({}, style, this.contentStyle);
      return style;
    },
  },

  data() {
    return {
      show: false,
      height: '',
      headerHeight: 50,
    };
  },

  mounted() {
    if (this.appendToBody) {
      document.body.appendChild(this.$el);
    }
  },

  destroyed() {
    if (this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
  },

  methods: {
    handleClose() {
      this.show = false;
    },

    handleBack() {
      this.$emit('back');
    },

    handleConfirm() {
      this.$emit('confirm');
      this.handleClose();
    },

    afterLeave() {
      this.$emit('close');
    },

    // 限高，最高不遮盖播放器区域
    setHeight() {
      if (this.fullScreen) {
        this.height = '100%';
        return;
      }
      let ratio = 16 / 9;
      const popupEl = this.$refs.popup;
      const popupContentEl = this.$refs.popupContent;
      if (!this.defaultDpi) {
        ratio = 4 / 3;
      }
      const playerHeight = window.innerWidth / ratio;
      const maxHeight = popupEl.offsetHeight - playerHeight;
      // 高度遮盖播放器，或始终需要占满除播放器以外高度
      if (popupContentEl.offsetHeight > maxHeight || this.fitLeftHeight) {
        this.height = `${popupEl.offsetHeight - playerHeight}px`;
      }
    },

    setHeaderHeight() {
      if (this.$slots.header) {
        const customHeaderEl = this.$refs.customHeader;
        this.headerHeight = `${customHeaderEl.offsetHeight || 50}px`;
      }
    },
  },
};
</script>

<style>
@import '../../assets/style/animation.scss';

.c-popup {
  z-index: 10001;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding-top: 56.25%;
  box-sizing: border-box;
}
.c-popup--fullscreen {
  padding-top: 0;
}
.c-popup__bg {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
}
.c-popup-content {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  background-color: #fff;
  border-radius: 8px 8px 0 0;
  max-height: 100vh;
  padding-top: 50px;
  box-sizing: border-box;
}
.c-popup__header {
  position: absolute;
  top: 0;
  width: 100%;
  height: 50px;
  border-bottom: 1px solid #EDEDEF;
}
.c-popup__header h2 {
  line-height: 50px;
  text-align: center;
  color: #333;
  font-size: 16px;
  font-weight: 400;
  margin: 0;
}
.c-popup__custom-header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}
.c-popup-btn {
  position: absolute;
  top: 0;
  display: block;
  width: 50px;
  height: 50px;
  background-size: 28px;
  background-position: center;
  background-repeat: no-repeat;
}
.c-popup-btn__close {
  right: 0;
}
.c-popup-btn__back {
  left: 0;
}
.c-popup-body {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: auto;
}
</style>
