import throttle from 'lodash-es/throttle';
import { liveSdk, PolyvLiveSdk } from '../../assets/live-sdk/live-sdk';
import channelBaseMixin from '../../assets/mixins/channel-base';
import { getRandom, delay } from '../../assets/utils/utils';
import { config } from '../../assets/utils/config';
import likeApi from '../../assets/api/like';

/**
 * 点赞mixin
 * 1. 点击按钮本地记录点击次数，每5秒发送socket与后端接口
 * 2. 点击事件做200ms的节流处理
 * 3. 所有新增的点赞进队列，每200ms清队释放
 * 4. 动效组件里最多同时显示30次动效
 * 5. 默认每10秒随机出现3-5个动效
 * -------------------------
 * @prop {Object} channel 频道信息
 * -------------------------
 * @data {Number} realtimeLikes 显示的点赞数
 */
export default {
  mixins: [channelBaseMixin],

  data() {
    return {
      realtimeLikes: 0, // 显示的点赞数
      likesNumberQueue: 0, // 点赞数队列
      likesAnimQueue: 0, // 点赞动效队列
      selfLikeCount: 0, // 记录5秒内自己点赞的次数
      defaultTimer: null,
      sendLikeTimer: null,
      floatIconTimer: null,
    };
  },

  props: {
    channel: Object,
  },

  watch: {
    'channel.likes': {
      immediate: true,
      handler: function(likes) {
        if (likes > this.realtimeLikes) {
          this.realtimeLikes = likes;
        }
      }
    }
  },

  mounted() {
    this.setSendTimer();
    this.setVisionTimer();
    this.createDefaultHeart();
    liveSdk.on(PolyvLiveSdk.EVENTS.LIKES, this.handleLikes);
  },

  beforeDestroy() {
    clearInterval(this.sendLikeTimer);
    this.sendLikeTimer = null;
    clearInterval(this.floatIconTimer);
    this.floatIconTimer = null;
    clearTimeout(this.defaultTimer);
    this.defaultTimer = null;
    liveSdk.off(PolyvLiveSdk.EVENTS.LIKES, this.handleLikes);
  },

  computed: {
    formatLikes() {
      let likes = this.realtimeLikes;
      if (likes >= 10000 && likes < 100000) {
        likes = ((likes / 10000) * 100) / 100;
        if (/^\d{1,}\./.test(`${likes}`)) {
          // 浮点数
          likes += '00';
          likes = likes.substr(0, 5);
        } else {
          // 非浮点数
          likes += '.00';
          likes = likes.substr(0, 5);
        }
        const formatRegExp = /^\d{1,2}.\d{2}/.exec(likes);
        likes = formatRegExp[0] + 'w';
      } else {
        if (likes >= 100000) {
          likes = Math.floor(likes / 10000) + 'w';
        }
      }
      return likes;
    },
  },

  methods: {
    // 默认动效
    async createDefaultHeart() {
      const count = getRandom(2, 5);

      for (let i = 1; i <= count; i++) {
        this.addFloatIcon();
        await delay(parseInt(3000 / count));
      }
      this.defaultTimer = setTimeout(this.createDefaultHeart, 10 * 1000);
    },

    // 定时发送5秒内的点赞次数
    setSendTimer() {
      this.sendLikeTimer = setInterval(() => {
        this.sendLikes();
      }, 5000);
    },

    // 发送点赞socket与接口
    async sendLikes() {
      const selfLikeCount = this.selfLikeCount;
      if (this.selfLikeCount) {
        liveSdk.sendLike(selfLikeCount);
        try {
          await likeApi.sendLikes(selfLikeCount);
        } catch (e) {
          console.warn(e);
        } finally {
          this.selfLikeCount = this.selfLikeCount - selfLikeCount;
        }
      }
    },

    // 处理点赞队列
    setVisionTimer() {
      this.floatIconTimer = setInterval(() => {
        // 点赞数队列全部合并进实时点赞数
        this.realtimeLikes += this.likesNumberQueue;
        this.likesNumberQueue = 0;

        if (this.likesAnimQueue <= 0) { return; }

        this.likesAnimQueue--;
        this.addFloatIcon();
      }, 200);
    },

    // 向动效插入动画
    addFloatIcon() {
      const floatIcon = this.$refs.floatIcon;
      if (floatIcon.iconList && floatIcon.iconList.length <= 30 && !document.hidden) {
        floatIcon.add();
      }
    },

    // 处理点赞socket消息
    handleLikes(event, data) {
      if (!data.userId || String(data.userId) === String(config.user.userId)) { return; } // 自己的点赞回调消息，忽略
      const count = (data && data.count) || 1;
      this.pushQueue(count);
    },

    // 向队列入队
    pushQueue(count = 1) {
      this.likesNumberQueue += count;
      this.likesAnimQueue += count;
    },

    // 点击点赞
    handleClickLike: throttle(function() {
      this.pushQueue(1);
      this.selfLikeCount += 1;
    }, 200)
  }
};
