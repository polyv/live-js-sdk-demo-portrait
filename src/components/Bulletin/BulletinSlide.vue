<template>
  <div
    v-show="showBulletin"
    class="c-bulletin-slide">
    <i class="g-icon i-notice"></i>
    <span class="c-bulletin-slide__title">公告：</span>
    <div
      ref="bulletinContent"
      class="c-bulletin-slide__content">
      <div
        ref="bulletinText"
        class="c-bulletin-slide__content__text">{{ bulletinText }}</div>
    </div>
  </div>
</template>

<script>
import mixin from './mixin';
import { setStyle } from '../../assets/utils/dom';

export default {
  mixins: [mixin],

  data() {
    return {
      showBulletin: false,
      animationTimer: null
    };
  },

  watch: {
    bulletinText() {
      this.showBulletin = !!this.bulletinText;

      this.$nextTick(() => {
        this.createAnimation();
      });
    }
  },

  methods: {
    createAnimation() {
      // 创建前先重置
      this.destroyAnimation();

      const contentDom = this.$refs.bulletinContent;
      const textDom = this.$refs.bulletinText;
      const displacement = textDom.clientWidth - contentDom.clientWidth;
      // 基础时间
      const baseTime = 4;
      // 公告没过长，不显示动画，4秒后消失
      if (displacement <= 0) {
        this.animationTimer = setTimeout(() => {
          this.showBulletin = false;
        }, baseTime * 1000);
        return;
      }
      // 滑动时间为：(文本长度 / 显示区域长度) * 基础时间
      const second = parseInt((textDom.clientWidth / contentDom.clientWidth) * baseTime, 10);
      setStyle(textDom, 'transition', `left ${second}s linear`);
      setStyle(textDom, 'left', `-${displacement}px`);

      // 动画结束，清空动画属性
      this.animationTimer = setTimeout(() => {
        this.destroyAnimation();
        this.showBulletin = false;
      }, (second + 2) * 1000);
    },
    destroyAnimation() {
      const textDom = this.$refs.bulletinText;
      clearTimeout(this.animationTimer);
      setStyle(textDom, 'transition', '');
      setStyle(textDom, 'left', '');
    }
  }
};
</script>

<style>
.c-bulletin-slide {
  position: absolute;
  top: 66px;
  left: 15px;
  height: 24px;
  border-radius: 12px;
  background: rgba(1, 129, 255, .7);
  padding: 0 15px 0 8px;
  display: flex;
  align-items: center;
  color: #fff;
  font-size: 12px;
  max-width: 345px;
  box-sizing: border-box;
  z-index: 12;
}
.c-bulletin-slide .i-notice {
  width: 12px;
  height: 12px;
}
.c-bulletin-slide__title {
  margin-left: 4px;
}
.c-bulletin-slide__content {
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
}
.c-bulletin-slide__content__text {
  position: relative;
  left: 0;
  display: inline-block;
}
</style>
