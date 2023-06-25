<template>
  <div class="c-rtc-item">
    <div :id="`plv-rtc-item__${elId}`" class="c-rtc-item__container"></div>
  </div>
</template>

<script>
export default {
  props: {
    elId: String,
  }
};
</script>

<style lang="scss">
.c-rtc-item__container {
  height: 100%;
}
</style>
