<template>
  <div class="c-rtc-item">
    <div :id="`plv-rtc-item__${elId}`" class="c-rtc-item__container"></div>
    <div v-if="stream.playFail"  class="plv-rtc-item__fail">
      <img
        src="./img/play-btn.png"
        alt="btn"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    elId: String,
    stream: Object
  },
  watch: {
    'stream.playFail': {
      handler(val) {
        if (val) {
          document.addEventListener('click', this.resume);
        } else {
          document.removeEventListener('click', this.resume);
        }
      }
    }
  },
  methods: {
    resume() {
      this.stream.resume();
      this.$emit('resume');
    }
  }
};
</script>

<style lang="scss">
.c-rtc-item {
  position: relative;
}
.c-rtc-item__container {
  height: 100%;
}
.plv-rtc-item__fail {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  & > img {
    width: 100px;
    height: 100px;
  }
}
</style>
