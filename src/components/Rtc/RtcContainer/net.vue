<template>
  <div :class="['c-net', `c-net__${status}`]">
    <div class="c-net__content"></div>
    <div class="c-net__content"></div>
    <div class="c-net__content"></div>
  </div>
</template>

<script>

export default {
  name: 'Net',

  props: {
    uplink: Number
  },

  computed: {
    status() {
      const { uplink } = this;
      let status = 0;
      switch (Number(uplink)) {
        case 6:
          // 断网
          status = 0;
          break;
        case 0:
        case 1:
        case 2:
          // 未知
          // 优秀
          // 良好
          status = 1;
          break;
        case 3:
          // 一般
          status = 2;
          break;
        case 4:
        case 5:
          // 较差
          // 糟糕
          status = 3;
          break;
      }

      return status;
    }
  }
};
</script>

<style lang="scss" scoped>
  .c-net {
    display: flex;
    cursor: pointer;
    height: 11px;

    .c-net__content {
      width: 2px;
      background-color: #D8D8D8;
      margin-right: 2px;
    }

    .c-net__content:nth-child(1) {
      height: 5px;
      transform: translateY(6px);
    }

    .c-net__content:nth-child(2) {
      height: 8px;
      transform: translateY(3px);
    }

    .c-net__content:nth-child(3) {
      height: 11px;
    }
  }

  .c-net__1 {
    .c-net__content {
      background-color: #04C548;
    }
  }

  .c-net__2 {
    .c-net__content:nth-child(1),
    .c-net__content:nth-child(2) {
      background-color: #D8D8D8;
    }
  }

  .c-net__3 {
    .c-net__content:nth-child(1) {
      background-color: #FF9500;
    }
  }
</style>
