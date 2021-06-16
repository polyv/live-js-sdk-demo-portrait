<template>
  <msg-container :msg="msg">
    <span class="c-chat-img-msg">
      <img :src="resizeUrl" @click="previewImg" />
    </span>
  </msg-container>
</template>

<script>
import MsgContainer from './MsgContainer';

export default {
  components: {
    MsgContainer
  },

  props: {
    msg: Object
  },

  computed: {
    imgUrl() {
      return this.msg.content.uploadImgUrl.replace(/^http(s?):\/\//, '//');
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

<style>
.c-chat-img-msg {
  display: inline-block;
  width: 36px;
  height: 36px;
  overflow: hidden;
  margin-bottom: -2px;
}
.c-chat-img-msg img {
  width: 36px;
  height: 36px;
  border-radius: 4px;
  margin-top: 2px;
  margin-bottom: 2px;
  object-fit: cover;
}
</style>
