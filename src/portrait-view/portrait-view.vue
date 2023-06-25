<template>
  <div
    v-if="channelDetail"
    class="c-portrait-view"
    :style="watchStyle">
    <!-- 签到 -->
    <mobileCheckIn v-show="!isSmallWindow" />
    <!-- 普通抽奖 -->
    <mobileLottery v-show="!isSmallWindow" />
    <!-- 问卷 -->
    <questionnaire v-show="!isSmallWindow" />
    <!-- 答题卡 -->
    <answer-card v-show="!isSmallWindow" />
    <!-- 快速答题卡 -->
    <quick-answer-card v-show="!isSmallWindow" />
    <!-- 举报反馈/投诉 -->
    <feed-back v-show="!isSmallWindow" />
    <!-- 关注公众号 -->
    <promotion-layer
      v-show="!isSmallWindow"
      :visible="promotionLayerVisible"
      :data="channelDetail.channelPromotion"
      @close="promotionLayerVisible = false" />
    <!-- 播放器 -->
    <player
      ref="cPlayer"
      :channel="channelDetail"
      :is-small-window="isSmallWindow"
      :client-width="clientWidth"
      @handleChangeToNormal="waitForRecover"
      @player-init="handlePlayerInit" />
    <div class="c-rtc__list">
      <main-item elId="master" class="c-rtc-master-item" />
      <div class="c-rtc__list-other">
        <template v-for="(item) of rtcList">
          <main-item :elId="item.streamId" :key="item.streamId" class="c-rtc__list-other-item" />
        </template>
      </div>
    </div>
    <local-rtc-item
      v-if="localStream"
      can-drag
      :mic-on="localStreamMic"
      :cam-on="localStreamCam"
      :nick="rtcInstance.config.nick"
      :up-link="localUplink"
    />

    <div class="c-portrait-view__swiper__wrap">
      <swiper
        ref="swiper"
        class="c-portrait-view__swiper"
        :class="[isSmallWindow ? 'swiper-no-swiping' : '']"
        :options="swiperOptions">
        <swiper-slide>
          <swiper-page>
            <boundary-wrap v-if="channelInfoSeat === 0">
              <!-- 频道基本信息 -->
              <channel-info v-show="!isSmallWindow" :channel="channelDetail" @follow="promotionLayerVisible = true" />
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
            <!-- 滑动公告 -->
            <boundary-wrap v-show="!isSmallWindow">
              <!-- 频道基本信息 -->
              <channel-info
                @follow="promotionLayerVisible = true"
                :channel="channelDetail" />
              <bulletin-slide />
            </boundary-wrap>
            <!-- 聊天室 -->
            <chat
              v-show="!isSmallWindow"
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
import WebViewMixin from './mixins/webview';
import RtcMixin from './mixins/rtc-mixin';
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
import ProductList from '../components/ProductList/ProductList';
import PlayerUi from '../components/PlayerUI/PlayerUI';
import BoundaryWrap from './components/BoundaryWrap';
import DocSwitch from '../components/DocSwitch/DocSwitch';
import ChapterList from '../components/ChapterList/ChapterList';
import Questionnaire from '../components/Questionnaire/MobileQuestionnaire';
import AnswerCard from '../components/AnswerCard/MobileAnswerCard';
import QuickAnswerCard from '../components/AnswerCard/MobileQuickAnswerCard';
import FeedBack from '../components/FeedBack/MobileFeedBack.vue';
import PromotionLayer from '../components/PromotionLayer/PromotionLayer';
import MobileLottery from '../components/Lottery/MobileLottery';
import MobileCheckIn from '../components/CheckIn/MobileCheckIn';
import MainItem from '../components/Rtc/RtcContainer/main-item.vue';
import LocalRtcItem from '../components/Rtc/RtcContainer/local-rtc-item.vue';

export default {
  name: 'plv-portrait-view',

  mixins: [channelBaseMixin, mixin, playerControlMixin, WebViewMixin, RtcMixin],

  data() {
    return {
      promotionLayerVisible: false,
      channelDetail: null,
      detailData: {}
    };
  },
  computed: {
    promotionEnabled() {
      return this.channelDetail?.channelPromotion && this.ynToBool(this.channelDetail?.channelPromotion?.followEnabled);
    },
  },
  watch: {
    promotionEnabled(newVal) {
      this.promotionLayerVisible = newVal && this.ynToBool(this.channelDetail?.channelPromotion?.followAutoShow);
    }
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
    ProductList,
    PlayerUi,
    BoundaryWrap,
    DocSwitch,
    ChapterList,
    Questionnaire,
    AnswerCard,
    QuickAnswerCard,
    FeedBack,
    PromotionLayer,
    MobileLottery,
    MobileCheckIn,
    MainItem,
    LocalRtcItem,
  },

  methods: {
    async initPortrait() {
      createLiveSdk().then(() => {
        this.initSdkEvent();
      });
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

<style lang="scss">
html {
  height: 100%;
}
/* 避免小窗口下 网速慢时出现白屏 */
body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
  background-image: url('../components/Player/imgs/player-bg.png');
  background-size: cover;
}
.c-portrait-view {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Microsoft YaHei, Arial,sans-serif;
  line-height: 1;
  box-sizing: border-box;
  height: 100%;
}

.c-rtc__list {
  position: absolute;
  z-index: 11;
  overflow-x: auto;
  top: 16.6%;
}

.c-rtc__list-other {
  height: 80px;
  position: relative;
  overflow-x: auto;
  white-space: nowrap;
}

.c-rtc__list-other-item {
  height: 100%;
  display: inline-block;
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
.plv-iar-default-btn {
  background: #FFA611 !important;
}
.plv-iar-default-btn:disabled {
  opacity: 0.6;
}
.plv-iar-quick-answer-default__btn {
  background: #FFA611 !important;
}
.p-watch--small-window .c-player {
  z-index: 10001;
}
.c-hide {
  display: none !important;
}
</style>
