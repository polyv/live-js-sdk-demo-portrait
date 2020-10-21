<template>
  <div class="c-img-viewer" @click="close">
    <img
      class="c-img-viewer__pic"
      :src="url" />
  </div>
</template>

<script>
export default {
  props: {
    url: String
  },

  methods: {
    close() {
      this.$el.parentNode.removeChild(this.$el);
      this.$destroy(true);
    }
  },

  mounted() {
    document.body.appendChild(this.$el);
  }
};
</script>

<style>
.c-img-viewer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, .5);
}
.c-img-viewer__pic {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 80%;
  max-height: 80%;
  vertical-align: middle;
  cursor: zoom-out;
}
</style>
