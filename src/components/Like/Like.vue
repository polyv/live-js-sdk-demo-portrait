<template>
  <div
    class="c-like"
    :class="{
      'c-like--deviation': seatType === 'deviation',
    }">
    <div
      class="c-like__icon g-icon i-like"
      @click="handleClickLike"></div>
    <div class="c-like__number">{{ formatLikes }}</div>
    <div class="c-like__float">
      <float-icon ref="floatIcon" />
    </div>
  </div>
</template>

<script>
import FloatIcon from '../FloatIcon/FloatIcon';
import mixin from './mixin';

export default {
  mixins: [mixin],

  components: {
    FloatIcon
  },

  props: {
    /**
     * 显示的位置，空或deviation
     * 在没有菜单栏时位置偏下
     */
    seatType: {
      type: String,
      default: ''
    }
  },
};
</script>

<style>
.c-like {
  position: absolute;
  bottom: 64px;
  right: 16px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.c-like__icon {
  width: 32px;
  height: 32px;
}
.c-like__number {
  font-size: 12px;
  color: #fff;
  margin-top: 3px;
}
.c-like__float {
  width: 42px;
  height: 160px;
  position: absolute;
  z-index: -1;
  bottom: 23px;
  left: 50%;
  transform: translateX(-50%);
}
.c-like--deviation {
  bottom: 16px;
}
.c-like--deviation .c-like__number {
  width: 36px;
  height: 14px;
  line-height: 14px;
  text-align: center;
  border-radius: 7px;
  background: rgba(0, 0, 0, .39);
  position: absolute;
  left: 50%;
  bottom: 37px;
  margin-left: -18px;
}
.c-like--deviation .c-like__float {
  bottom: 52px;
}
</style>
