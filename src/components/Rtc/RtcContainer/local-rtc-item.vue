<template>
  <div
    class="c-rtc-item__local"
    ref="c-rtc-item__local"
    :style="`transform: translate3d(${moveInfoX}px, ${moveInfoY}px, 0px); width: ${elWidth}px; height: ${elHeight}px`"
  >
    <div id="plv-rtc-item__local"></div>
    <img
      v-if="!camOn"
      src="./img/cam-off.png"
      alt="cam-off"
      class="plv-rtc-item__cam" />
    <RtcInfo class="plv-rtc-item__info" :mic="micOn" :name="nick" />
  </div>
</template>

<script>
import RtcInfo from './rtc-info.vue';
const startInfo = {
  clientX: 0,
  clientY: 0,
};
export default {
  data() {
    return {
      clientHeight: 0,
      clientWidth: 0,
      moveInfoX: 8,
      moveInfoY: 0,
    };
  },

  components: { RtcInfo },

  props: {
    canDrag: Boolean,
    elWidth: {
      type: Number,
      default: 90
    },
    elHeight: {
      type: Number,
      default: 160
    },
    micOn: Boolean,
    camOn: Boolean,
    nick: String,
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
      this.moveInfoX = this.clientWidth - this.elWidth - 8;
      this.moveInfoY = Math.floor(this.clientHeight * 0.7);
    },
    touchStart(ev) {
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
      this.$refs['c-rtc-item__local'].removeEventListener('touchmove', this.touchMove);
      this.$refs['c-rtc-item__local'].removeEventListener('touchend', this.touchEnd);
      this.autoConnect();
    },

    // 自动吸附
    autoConnect() {
      // 向左吸附
      this.$refs['c-rtc-item__local'].classList.add('c-rtc-item__local__auto-connect');
      if (this.moveInfoX + this.elWidth / 2 <= this.clientWidth / 2) {
        this.moveInfoX = 8;
      } else { // 向右吸附
        this.moveInfoX = this.clientWidth - this.elWidth - 8;
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
  border-radius: 8px;
}
#plv-rtc-item__local {
  height: 100%;
  width: 100%;
}
.plv-rtc-item__cam {
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
  left: 0;
}
.c-rtc-item__local__auto-connect {
  transition: transform ease-in-out .3s;
}
.plv-rtc-item__info {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 35px;
  box-sizing: border-box;
  padding: 8px;
}
</style>
