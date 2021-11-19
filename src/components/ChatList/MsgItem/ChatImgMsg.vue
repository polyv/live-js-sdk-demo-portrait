<template>
  <div class="c-chat-img-msg">
    <img :src="resizeUrl" @click="previewImg" />
  </div>
</template>

<script>

export default {
  components: {
  },

  props: {
    msg: Object
  },

  computed: {
    imgUrl() {
      const url = this.msg?.content?.uploadImgUrl || this.msg?.image?.url;
      return url.replace(/^http(s?):\/\//, '//');
    },
    resizeUrl() {
      return this.resizeImg(this.imgUrl, 100, 100);
    }
  },

  methods: {
    previewImg() {
      this.$previewImage(this.imgUrl);
    }
  }
};
</script>

<style lang="scss">
.c-chat-img-msg img {
  width: 68px;
  height: 68px;
  border-radius: 4px;
  margin: 4px 0;
  object-fit: contain;
}
</style>
