<template>
  <div>
    <transition name="fade">
      <div v-show="visible" class="c-promotion-layer" @click.self="$emit('close')">
        <div class="c-promotion-layer__inner">
          <div class="c-promotion-layer__box">
            <div class="c-promotion-layer__text__wrap">
              <p class="c-promotion-layer__text">
                {{ data.followTips }}
              </p>
            </div>
            <div class="c-promotion-layer__img">
              <img :src="data.followImage" :alt="data.followTips" />
            </div>
          </div>
          <i class="c-promotion-layer__close" @click="$emit('close')"></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },

    data: {
      type: Object,
      required: true
    }
  }
};
</script>

<style lang="scss">
.c-promotion-layer {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
}

.c-promotion-layer__inner {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.c-promotion-layer__box {
  width: 259px;
  height: 264px;
  background: url('./imgs/promotion-background.png') no-repeat;
  background-size: contain;
  text-align: center;
}

.c-promotion-layer__img {
  padding-top: 35px;
}
.c-promotion-layer__img img {
  width: 99px;
  height: 99px;
}

.c-promotion-layer__text__wrap {
  position: relative;
  width: 100%;
  height: 76px;
  text-align: center;
}

.c-promotion-layer__text {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 192px;
  line-height: 1.5;
  font-size: 16px;
  color: #DC5723;
}

.c-promotion-layer__close {
  position: absolute;
  top: 264px;
  left: 114px;
  width: 32px;
  height: 56px;
  background-image: url(./imgs/mobile-promotion-close.png);
  background-size: contain;
}
</style>
