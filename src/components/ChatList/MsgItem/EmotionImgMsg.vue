<template>
  <div class="c-emotion-img-msg">
    <!-- 占位图 -->
    <img v-if="!loaded" class="c-img-msg__placeholder" :src="imgMsgPlaceholder" />
    <img
      ref="img"
      v-show="loaded"
      :src="msg.content || msg.image.url"
      :data-src="msg.content || msg.image.url"
      @load="onLoad"
      @click="previewImg"
    />
  </div>
</template>

<script>
import imgMsgPlaceholder from './imgs/img-msg-placeholder.png';

export default {
  props: {
    msg: Object,
  },
  components: {
  },
  data() {
    return {
      // 加载完成前的占位图
      imgMsgPlaceholder,
      // 是否加载完成
      loaded: false,
    };
  },

  mounted() {
    if (this.$refs.img && this.$refs.img.complete) {
      this.loaded = true;
    }
  },

  methods: {
    onLoad() {
      if (this.loaded) { return; }
      this.loaded = true;
    },

    previewImg() {
      this.$previewImage(this.msg?.content || this.msg?.image?.url);
    }
  },

};
</script>

<style lang="scss">
.c-emotion-img-msg img {
  width: 68px;
  height: 68px;
  border-radius: 4px;
  margin: 4px 0;
  object-fit: contain;
}
</style>
