<template>
  <div
    class="c-rtc-item__local"
    ref="c-rtc-item__local"
    :style="`transform: translate3d(${moveInfoX}px, ${moveInfoY}px, 0px); width: ${elWidth}px; height: ${elHeight}px`"
  >
    <div id="plv-rtc-item__local"></div>
  </div>
</template>

<script>
const startInfo = {
  clientX: 0,
  clientY: 0,
};
export default {
  data() {
    return {
      clientHeight: 0,
      clientWidth: 0,
      moveInfoX: 0,
      moveInfoY: 0,
    };
  },

  props: {
    canDrag: Boolean,
    elWidth: {
      type: Number,
      default: 100
    },
    elHeight: {
      type: Number,
      default: 150
    },
  },

  mounted() {
    this.getClientRects();
    this.canDrag && this.$refs['c-rtc-item__local'].addEventListener('touchstart', this.touchStart);
  },

  beforeDestroy() {
    this.$refs['c-rtc-item__local'].removeEventListener('touchstart', this.touchStart);
  },

  methods: {
    getClientRects() {
      const { height, width } = document.body.getBoundingClientRect();
      this.clientHeight = Math.floor(height);
      this.clientWidth = Math.floor(width);
    },
    touchStart(ev) {
      console.log('-> touchStart', ev);
      this.$refs['c-rtc-item__local'].addEventListener('touchmove', this.touchMove);
      this.$refs['c-rtc-item__local'].addEventListener('touchend', this.touchEnd);
      startInfo.clientX = Math.floor(ev.touches[0].clientX);
      startInfo.clientY = Math.floor(ev.touches[0].clientY);
    },

    touchMove(ev) {
      const currentX = Math.floor(ev.touches[0].clientX);
      const currentY = Math.floor(ev.touches[0].clientY);
      const moveX = startInfo.clientX - currentX;
      const moveY = startInfo.clientY - currentY;

      startInfo.clientX = currentX;
      startInfo.clientY = currentY;
      this.moveInfoX -= moveX;
      this.moveInfoY -= moveY;
      // 判断是否超出上左
      if (this.moveInfoX < 0) {
        this.moveInfoX = 0;
      }
      if (this.moveInfoY < 0) {
        this.moveInfoY = 0;
      }
      // 判断是否超出下右
      if (this.moveInfoX + this.elWidth > this.clientWidth) {
        this.moveInfoX = this.clientWidth - this.elWidth;
      }
      if (this.moveInfoY + this.elHeight > this.clientHeight) {
        this.moveInfoY = this.clientHeight - this.elHeight;
      }
    },

    touchEnd(ev) {
      console.log('-> touchEnd', ev);
      this.$refs['c-rtc-item__local'].removeEventListener('touchmove', this.touchMove);
      this.$refs['c-rtc-item__local'].removeEventListener('touchend', this.touchEnd);
      this.autoConnect();
    },

    // 自动吸附
    autoConnect() {
      // 向左吸附
      this.$refs['c-rtc-item__local'].classList.add('c-rtc-item__local__auto-connect');
      if (this.moveInfoX + this.elWidth / 2 <= this.clientWidth / 2) {
        this.moveInfoX = 0;
      } else { // 向右吸附
        this.moveInfoX = this.clientWidth - this.elWidth;
      }
      setTimeout(() => {
        this.$refs['c-rtc-item__local'].classList.remove('c-rtc-item__local__auto-connect');
      }, 300);
    }
  }
};
</script>

<style lang="scss">
.c-rtc-item__local {
  position: fixed;
  z-index: 11;
}
#plv-rtc-item__local {
  height: 100%;
  width: 100%;
}
.c-rtc-item__local__auto-connect {
  transition: transform ease-in-out .3s;
}
</style>
