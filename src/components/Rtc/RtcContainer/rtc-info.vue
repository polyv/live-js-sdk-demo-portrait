<template>
  <div class="c-rtc-info">
    <img v-if="!mic" src="./img/mic-off.png" alt="off"/>
    <img v-else src="./img/mic-on.png" alt="on"/>
    <span class="c-rtc-info__name">{{ name }}</span>
  </div>
</template>

<script>
export default {
  props: {
    name: String,
    mic: Boolean
  }
};
</script>

<style scoped lang="scss">
.c-rtc-info {
  display: flex;
  align-items: center;
  user-select: none;

  .c-rtc-info__name {
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: keep-all;
    user-select: none;
    margin-left: 4px;
    color: #fff;
    white-space: nowrap;
  }
}
</style>
