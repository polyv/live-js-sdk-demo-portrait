<template>
  <div
    data-player-click
    class="c-swiper-page"
    ref="swiperPage"
    @click="handleClick">
    <slot></slot>
  </div>
</template>

<script>
import { PLAYER_CLICK, bus } from '../../assets/utils/event-bus';

export default {
  methods: {
    handleClick(e) {
      // 具有data-player-click
      const hasDataSetPlayerClick = typeof e.target.dataset.playerClick !== 'undefined';

      if (hasDataSetPlayerClick) {
        bus.$emit(PLAYER_CLICK, e);
      }
    }
  }
};
</script>

<style>
.c-swiper-page {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
</style>
