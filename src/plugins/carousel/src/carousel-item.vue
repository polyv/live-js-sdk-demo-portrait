<template>
  <div class="plv-carousel-item" :style="itemStyle">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'plv-carousel-item',

  data() {
    return {
      slideIndex: undefined,
    };
  },

  computed: {
    itemStyle() {
      return {
        width: `${this.carousel.wrapWidth}px`,
        height: `${this.carousel.wrapHeight}px`,
      };
    },
  },

  inject: {
    carousel: {
      default: '',
    },
  },
};
</script>

<style>
.plv-carousel-item {
  width: 100%;
  height: 100%;
  display: flex;
  flex-shrink: 0;
}
</style>
