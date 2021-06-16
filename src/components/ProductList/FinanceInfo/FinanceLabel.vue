<!-- @file 金融商品标签组件 -->

<template>
  <div
    class="c-product-list__finance__label"
    :style="{
      width: `${width}px`
    }"
    :title="text">
    <span
      ref="labelContent"
      class="c-product-list__finance__label__content">{{ text }}</span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      width: 0
    };
  },

  props: {
    text: String,
  },

  watch: {
    text() {
      this.$nextTick(() => {
        this.setWidth();
      });
    }
  },

  methods: {
    setWidth() {
      const contentDom = this.$refs.labelContent;
      // 内容宽度 * 0.83得到10px字体大小下的宽度，再加上左右的内边距12px
      let width = contentDom.clientWidth * 0.83 + 12;
      width = width < 52 ? 52 : width;
      this.width = width;
    }
  },

  mounted() {
    this.setWidth();
  }
};
</script>

<style>
.c-product-list__finance__label {
  user-select: none;
  min-width: 52px;
  height: 18px;
  line-height: 18px;
  display: inline-block;
  flex-shrink: 0;
  position: relative;
  font-size: 12px;
  cursor: pointer;
}
.c-product-list__finance__label__content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(.83);
}
</style>
