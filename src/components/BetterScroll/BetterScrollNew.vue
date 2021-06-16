<template>
  <div
    ref="scroll"
    class="c-better-scroll"
    @scroll="handleScroll">
    <div
      ref="scrollContent"
      class="c-better-scroll__content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isScrollTop: true, // 当前位置是否在顶部
      isScrollBottom: true, // 当前是否在底部
      isScrolling: false, // 当前是否正在滚动
      scrollTimer: null,
    };
  },

  methods: {
    handleScroll(e) {
      this.$emit('scroll', e);
      const scrollDom = this.$refs.scroll;
      const contentDom = this.$refs.scrollContent;

      const offsetHeight = contentDom.offsetHeight;
      const clientHeight = scrollDom.clientHeight;
      const scrollTop = scrollDom.scrollTop;

      this.isScrolling = true;
      clearTimeout(this.isScrolling);
      this.scrollTimer = setTimeout(() => {
        this.isScrolling = false;
      }, 100);
      if (scrollTop <= 0) {
        this.isScrollTop = true;
        this.$emit('scrollTop');
      } else {
        this.isScrollTop = false;
      }

      if (scrollTop + clientHeight >= offsetHeight - 1) {
        this.isScrollBottom = true;
        this.$emit('scrollBottom');
      } else {
        this.isScrollBottom = false;
      }
    },

    // 滚到最底层
    scrollToBottom() {
      this.$nextTick(() => {
        const contentDom = this.$refs.scrollContent;
        this.$refs.scroll.scrollTop = contentDom.offsetHeight;
        this.isScrollBottom = true;
      });
    },

    scrollToElement(dom) {
      this.$nextTick(() => {
        const scrollTop = dom.offsetTop;
        this.$refs.scroll.scrollTop = scrollTop;
      });
    }
  }
};
</script>

<style>
.c-better-scroll {
  overflow-y: auto;
  height: 100%;
}
</style>
