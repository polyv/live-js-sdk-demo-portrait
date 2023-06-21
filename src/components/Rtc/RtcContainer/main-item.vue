<template>
  <div class="c-rtc-item">
    <div :id="`plv-rtc-item__${elId}`"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {

    };
  },

  props: {
    elId: String,
  }
};
</script>

<style lang="scss">
.c-rtc-item {

}
</style>
