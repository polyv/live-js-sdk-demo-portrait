<template>
  <transition
    :name="'c-heart-icon--' + type"
    @after-enter="handleEnter">
    <div
      v-if="visible"
      :class="[
        'c-heart-icon',
        'c-heart-icon--' + type
      ]"></div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      visible: false
    };
  },

  props: {
    type: {
      type: String,
      default: 'red'
    }
  },

  methods: {
    handleEnter() {
      this.visible = false;
      this.$emit('close');
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.visible = true;
    });
  }
};
</script>

<style>
.c-heart-icon {
  width: 24px;
  height: 24px;
  background-size: 100% 100%;
  position: absolute;
  opacity: 0;
}
.c-heart-icon--red {
  background-image: url(./imgs/heart-red.png);
}
.c-heart-icon--blue {
  background-image: url(./imgs/heart-blue.png);
}
.c-heart-icon--green {
  background-image: url(./imgs/heart-green.png);
}
.c-heart-icon--orange {
  background-image: url(./imgs/heart-orange.png);
}
.c-heart-icon--red-enter-active {
  left: 9px;
  top: 136px;
  opacity: 1;
  animation: float-heart-red 1.5s linear;
}
.c-heart-icon--green-enter-active {
  left: 9px;
  top: 136px;
  opacity: 1;
  animation: float-heart-green 1.5s linear;
}
.c-heart-icon--blue-enter-active {
  left: 9px;
  top: 136px;
  opacity: 1;
  animation: float-heart-blue 1.5s linear;
}
.c-heart-icon--orange-enter-active {
  left: 9px;
  top: 136px;
  opacity: 1;
  animation: float-heart-orange 1.5s linear;
}
/* 红心动画 */
@keyframes float-heart-red {
  0% {
    width: 24px;
    height: 24px;
    left: 9px;
    top: 136px;
    opacity: 1;
  }
  33% {
    width: 21px;
    height: 21px;
    left: 4px;
    top: 90px;
  }
  66% {
    width: 18px;
    height: 18px;
    left: 20px;
    top: 42px;
  }
  100% {
    width: 16px;
    height: 16px;
    left: 13px;
    top: 0;
    opacity: .2;
  }
}

/* 绿心动画 */
@keyframes float-heart-green {
  0% {
    width: 24px;
    height: 24px;
    left: 9px;
    top: 136px;
    opacity: 1;
  }
  50% {
    width: 20px;
    height: 20px;
    left: 0;
    top: 68px;
  }
  100% {
    width: 16px;
    height: 16px;
    left: 13px;
    top: 0;
    opacity: .2;
  }
}

/* 蓝心动画 */
@keyframes float-heart-blue {
  0% {
    width: 24px;
    height: 24px;
    left: 9px;
    top: 136px;
    opacity: 1;
  }
  50% {
    width: 20px;
    height: 20px;
    left: 18px;
    top: 68px;
  }
  100% {
    width: 16px;
    height: 16px;
    left: 13px;
    top: 0;
    opacity: .2;
  }
}

/* 橙心动画 */
@keyframes float-heart-orange {
  0% {
    width: 24px;
    height: 24px;
    left: 9px;
    top: 136px;
    opacity: 1;
  }
  33% {
    width: 21px;
    height: 21px;
    left: 14px;
    top: 90px;
  }
  66% {
    width: 18px;
    height: 18px;
    left: 4px;
    top: 42px;
  }
  100% {
    width: 16px;
    height: 16px;
    left: 13px;
    top: 0;
    opacity: .2;
  }
}
</style>
