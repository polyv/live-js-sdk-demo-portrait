<template>
  <div class="c-progress-bar">
    <i
      :class="['c-progress-bar__btn', 'g-img-cover', playBtnIcon]"
      @click="handleClickPlayBtn"></i>
    <!-- 播放进度 -->
    <p class="c-progress-bar__time">{{ currentTime | formTimeSecond }}</p>
    <!-- 进度条 -->
    <div
      class="c-progress-bar__silder__wrap"
      @touchstart.stop="handleTouchStart">
      <div
        ref="silder"
        class="c-progress-bar__silder">
        <span
          class="c-progress-bar__silder__inner"
          :style="silderInnerStyle"></span>
        <span
          class="c-progress-bar__silder__round"
          :style="dotStyle"></span>
      </div>
    </div>
    <!-- 总时间 -->
    <p class="c-progress-bar__time">{{ duration | formTimeSecond }}</p>
  </div>
</template>

<script>
import channelBaseMixin from '../../assets/mixins/channel-base';
import PlayEvents from '../../assets/live-sdk/player-evt';
import { formTimeSecond } from '../../assets/utils/utils';

export default {
  data() {
    return {
      duration: 0,
      currentTime: 0,
      dragging: false,
    };
  },

  mixins: [channelBaseMixin],

  props: {
    playerCtrl: Object
  },

  filters: {
    formTimeSecond
  },

  watch: {
    playerCtrl: {
      immediate: true,
      handler() {
        this.playerCtrl && this.listenPlayerEvt();
        this.playerCtrl && this.initData();
      },
    }
  },

  computed: {
    playBtnIcon() {
      return this.playerStatus === 'playing' ? 'i-pause' : 'i-play';
    },
    silderInnerStyle() {
      const persen = (this.currentTime / this.duration) * 100;
      return {
        width: `${persen}%`
      };
    },
    dotStyle() {
      const persen = (this.currentTime / this.duration) * 100;
      return {
        left: `${persen}%`
      };
    }
  },

  methods: {
    initData() {
      this.duration = this.playerCtrl.duration;
      this.currentTime = 0;
      this.dragging = false;
    },
    listenPlayerEvt() {
      this.playerCtrl.on(PlayEvents.TIME_UPDATE, ({ currentTime, duration }) => {
        if (this.dragging) { return; }
        this.duration = duration;
        this.currentTime = currentTime;
      });
    },
    handleClickPlayBtn() {
      if (this.playerStatus === 'playing') {
        this.playerCtrl.pause();
      } else {
        this.playerCtrl.resume();
      }
    },
    // 通过event计算出相应位置的秒数
    getTouchSecond(event, type = 'touch') {
      let touchX = 0;
      if (type === 'touch') {
        touchX = event.touches[0].pageX & event.changedTouches[0].pageX & event.targetTouches[0].pageX;
      }
      const silderX = this.$refs.silder.getBoundingClientRect().left;
      const silderWidth = this.$refs.silder.offsetWidth;
      const persen = (touchX - silderX) / silderWidth;
      let second = this.duration * persen;
      second = second <= 0 ? 0 : second;
      second = second > this.duration ? this.duration : second;
      return second;
    },
    handleTouchStart() {
      window.addEventListener('touchmove', this.onDragging);
      window.addEventListener('touchend', this.onDragEnd);
    },
    onDragging(event) {
      this.dragging = true;
      this.playerCtrl.pause();
      const second = this.getTouchSecond(event);
      this.currentTime = second;
    },
    onDragEnd() {
      if (this.dragging) {
        this.playerCtrl.seek(this.currentTime);
        this.playerCtrl.resume();
      }
      this.dragging = false;
      window.removeEventListener('touchmove', this.onDragging);
      window.removeEventListener('touchend', this.onDragEnd);
    }
  }
};
</script>

<style>
.c-progress-bar {
  position: relative;
  height: 32px;
  display: flex;
  align-items: center;
  user-select: none;
}

.c-progress-bar__btn {
  width: 18px;
  height: 18px;
  display: inline-block;
  margin-right: 16px;
}

.c-progress-bar__time {
  width: 50px;
  text-align: center;
  font-size: 12px;
  color: #fff;
  white-space: nowrap;
}

.c-progress-bar__silder__wrap {
  margin-left: 16px;
  margin-right: 16px;
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
}

.c-progress-bar__silder {
  height: 2px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.4);
  position: relative;
  display: flex;
  flex: 1;
  align-items: center;
}

.c-progress-bar__silder__inner {
  background: #FFC815;
  height: 2px;
  border-radius: 2px;
}

.c-progress-bar__silder__round {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #fff;
  transform: translate(-6px, -50%);
  position: absolute;
  top: 50%;
}
</style>
