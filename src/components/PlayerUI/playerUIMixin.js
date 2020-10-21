import { mapState } from 'vuex';
import { PLAYER_CLICK, bus } from '@/portrait/assets/utils/eventBus';
import settingData from './components/settingData';
import { checkDomClick } from '@/portrait/assets/player/player-utils';

export default {
  data() {
    return {
      currentRate: settingData.rate[0].value, // 选择的倍速,
      clickCount: 0,
      clickTimer: null
    };
  },

  computed: {
    ...mapState({
      logoHref: state => state.portraitPlayer.logoHref,
      advertHref: state => state.portraitPlayer.advertHref,
      warmupImgClickUrl: state => state.portraitPlayer.warmupImgClickUrl,
    })
  },

  watch: {
    currentRate() {
      this.playerCtrl.changeRate(this.currentRate);
    }
  },

  methods: {
    openUrl(url) {
      if (url) {
        window.open(url, '_blank');
      }
    },
    handlePlayerClick(event) {
      // 正在显示暂无直播，忽略不处理
      const notLiveDom = document.querySelector('[data-not-live]');
      if (notLiveDom) { return; }

      // 正在显示广告
      const advertDom = document.querySelector('.plv-live-ad__img');
      if (advertDom && checkDomClick(advertDom, event)) {
        this.openUrl(this.advertHref);
        return;
      }

      // 判断logo点击
      const logoDom = document.querySelector('.plv-live-logo');
      if (logoDom && checkDomClick(logoDom, event)) {
        this.openUrl(this.logoHref);
        return;
      }

      // 正在显示暖场图片
      const warmImgDom = document.querySelector('.plv-live-warmUp .plv-cover-box');
      if (warmImgDom && checkDomClick(warmImgDom, event)) {
        this.openUrl(this.warmupImgClickUrl);
        return;
      }

      if (this.playerCtrl.isShowAdvert) { return; }

      this.clickCount++;
      this.clickTimer && clearTimeout(this.clickTimer);
      this.clickTimer = setTimeout(() => {
        if (this.playerStatus === 'stoped') {
          this.playerCtrl.resume();
        } else if (this.clickCount >= 2) {
          this.playerCtrl.pause();
        }
        this.clickCount = 0;
        this.clickTimer = null;
      }, 200);
    },
  },

  created() {
    bus.$on(PLAYER_CLICK, this.handlePlayerClick);
  },

  beforeDestroy() {
    clearTimeout(this.clickTimer);
    this.clickTimer = null;
    bus.$off(PLAYER_CLICK, this.handlePlayerClick);
  }
};
