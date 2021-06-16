<template>
  <div
    v-if="channelDetail"
    class="c-portrait-view"
    :style="watchStyle">
    <!-- 播放器 -->
    <player
      :channel="channelDetail"
      @player-init="handlePlayerInit" />

    <div class="c-portrait-view__swiper__wrap">
      <swiper
        class="c-portrait-view__swiper"
        :options="swiperOptions">
        <swiper-slide>
          <swiper-page>
            <boundary-wrap v-if="channelInfoSeat === 0">
              <!-- 频道基本信息 -->
              <channel-info :channel="channelDetail" />
            </boundary-wrap>
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
            <channel-info
              v-if="channelInfoSeat === 1"
              :channel="channelDetail" />
            <!-- 滑动公告 -->
            <boundary-wrap>
              <bulletin-slide />
            </boundary-wrap>
            <!-- 聊天室 -->
            <chat
              :playerCtrl="playerCtrl"
              :channel="channelDetail" />
            <!-- 文档开关切换 -->
            <boundary-wrap
              v-if="documentSwitchVisible"
              seat="right">
              <doc-switch />
            </boundary-wrap>
            <!-- 打赏 -->
            <donate
              v-if="donateGoodEnabled"
              :channel="channelDetail" />
            <!-- 商品推送气泡 -->
            <product-bubble v-if="productEnabled" />
            <!-- 商品列表 -->
            <product-list v-if="productEnabled" />
            <!-- 播放器控制器 -->
            <player-ui :channel="channelDetail" :playerCtrl="playerCtrl" />
            <!-- 章节 -->
            <chapter-list
              :playerCtrl="playerCtrl"
              :chapterList="portraitState.chapterList"
              v-if="chapterVisible" />
          </swiper-page>
        </swiper-slide>

        <!-- 空白屏 -->
        <swiper-slide>
          <swiper-page />
        </swiper-slide>
      </swiper>
    </div>
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
import BoundaryWrap from './components/BoundaryWrap';
import DocSwitch from '../components/DocSwitch/DocSwitch';
import ChapterList from '../components/ChapterList/ChapterList';

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
    BoundaryWrap,
    DocSwitch,
    ChapterList,
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
.c-portrait-view {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Microsoft YaHei, Arial,sans-serif;
  line-height: 1;
  box-sizing: border-box;
}
.c-portrait-view__swiper__wrap {
  height: 100%;
  position: relative;
  z-index: 10;
}
.c-portrait-view__swiper {
  width: 100%;
  height: 100%;
  overflow: visible;
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
