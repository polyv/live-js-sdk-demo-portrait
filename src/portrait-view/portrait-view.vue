<template>
  <div
    v-if="channelDetail"
    class="c-portrait-view">
    <!-- 播放器 -->
    <player @player-init="handlePlayerInit" />

    <swiper
      class="c-portrait-view__swiper"
      :options="swiperOptions">
      <swiper-slide>
        <swiper-page>
          <div class="c-portrait-view__bulletin__intro">
            <!-- 公告 -->
            <bulletin-panel />
            <!-- 直播介绍 -->
            <intro :channel="channelDetail" />
          </div>
        </swiper-page>
      </swiper-slide>

      <swiper-slide>
        <swiper-page>
          <!-- 频道基本信息 -->
          <channel-info :channel="channelDetail" />
          <!-- 滑动公告 -->
          <bulletin-slide />
          <!-- 聊天室 -->
          <chat :channel="channelDetail" />
          <!-- 打赏 -->
          <donate
            v-if="donateGoodEnabled"
            :channel="channelDetail" />
          <!-- 商品推送气泡 -->
          <product-bubble v-if="productEnabled" />
          <!-- 商品列表 -->
          <product-list v-if="productEnabled" />
          <!-- 播放器控制器 -->
          <player-ui :channel="channelDetail" />
        </swiper-page>
      </swiper-slide>

      <!-- 空白屏 -->
      <swiper-slide>
        <swiper-page />
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
import mixin from './mixin';
import playerControlMixin from './mixins/player-control';
import channelBaseMixin from '../assets/mixins/channel-base';
import { createLiveSdk, destroyLiveSdk } from '../assets/live-sdk/live-sdk';
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import 'swiper/css/swiper.css';
import Player from '../components/Player/Player';
import SwiperPage from '../components/SwiperPage/SwiperPage';
import ChannelInfo from '../components/ChannelInfo/ChannelInfo';
import BulletinSlide from '../components/Bulletin/BulletinSlide';
import BulletinPanel from '../components/Bulletin/BulletinPanel';
import Intro from '../components/Intro/Intro';
import Chat from '../components/Chat/Chat';
import Donate from '../components/Donate/Donate';
import ProductBubble from '../components/ProductBubble/ProductBubble';
import ProductList from '../components/ProductList/ProductList';
import PlayerUi from '../components/PlayerUI/PlayerUI';

export default {
  name: 'plv-portrait-view',

  mixins: [channelBaseMixin, mixin, playerControlMixin],

  data() {
    return {
      channelDetail: null
    };
  },

  components: {
    Swiper,
    SwiperSlide,
    Player,
    SwiperPage,
    ChannelInfo,
    BulletinSlide,
    BulletinPanel,
    Intro,
    Chat,
    Donate,
    ProductBubble,
    ProductList,
    PlayerUi,
  },

  methods: {
    async initPortrait() {
      await createLiveSdk();
      this.initSdkEvent();
    },
  },

  mounted() {
    this.initPortrait();
  },

  beforeDestroy() {
    destroyLiveSdk();
  },

  // keep-alive模式下移除
  deactivated() {
    destroyLiveSdk();
  }
};
</script>

<style>
.test-click {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: red;
  z-index: 20;
  touch-action: manipulation;
}
.c-portrait-view {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Microsoft YaHei, Arial,sans-serif;
  line-height: 1;
}
.c-portrait-view__swiper {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
}
.c-portrait-view__bulletin__intro {
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
  box-sizing: border-box;
  padding: 0 15px;
  overflow-y: auto;
  max-height: 446px;
}
</style>
