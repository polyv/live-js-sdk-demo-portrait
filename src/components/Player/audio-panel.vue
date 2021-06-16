<template>
  <div class="c-player__wrap">
    <div class="c-player__wrap__content">
      <div class="c-player__wrap__content__section">
        <img :src="imgUrl" class="c-audio-panel__img" />
        <span>音频直播中</span>
      </div>
    </div>
  </div>
</template>

<script>
const animImgs = {
  anim1: require('./imgs/audio-1.png'),
  anim2: require('./imgs/audio-2.png'),
  anim3: require('./imgs/audio-3.png'),
};

export default {
  props: ['playerStatus'],

  data() {
    return {
      animTimer: null,
      animSeat: 1
    };
  },

  computed: {
    imgUrl() {
      return animImgs[`anim${this.animSeat}`];
    }
  },

  watch: {
    playerStatus: {
      immediate: true,
      handler(status) {
        if (status === 'playing') {
          this.startAnim();
        } else {
          this.stopAnim();
        }
      }
    }
  },

  methods: {
    startAnim() {
      this.animTimer = setInterval(() => {
        let seat = this.animSeat;
        seat++;
        if (seat > 3) {
          seat = 1;
        }
        this.animSeat = seat;
      }, 333);
    },
    stopAnim() {
      clearInterval(this.animTimer);
    }
  },

  beforeDestroy() {
    this.stopAnim();
  }
};
</script>

<style>
.c-audio-panel__img {
  width: 48px;
  height: 120px;
  margin-bottom: 15px;
}
</style>
