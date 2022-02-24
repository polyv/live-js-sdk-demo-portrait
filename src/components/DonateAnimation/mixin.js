/**
 * @file 打赏大动画特效公共逻辑
 */
import SVGA from 'svgaplayerweb';

const svgas = {
  coffee: 'coffee.svga',
  like: 'like.svga',
  handclap: 'handclap.svga',
  666: '666.svga',
  star: 'star.svga',
  diamond: 'diamond.svga',
  car: 'car.svga',
  rocket: 'rocket.svga',
  bear: 'bear.svga',
  crown: 'crown.svga',
  cup: 'cup.svga',
  microphone: 'microphone.svga',
  villa: 'villa.svga',
  house: 'villa.svga', // 旧版的house图匹配新版的别墅动画
};

// 记录加载的promise，避免重复加载
const loadSvgasPromise = {};
const BASE_URL = 'https://s1.videocc.net/default-img/donate-svga/';

export default {
  mounted() {
    this.initDonateAnimation();
    this.createPlayer();
  },

  beforeDestroy() {
    this.initDonateAnimation();
  },

  data() {
    return {
      parser: null, // svga加载器
      player: null, // 动画播放器
      donateQueue: [], // 播放队列
      isAniming: false, // 动画是否这种播放中
    };
  },

  watch: {
    isAniming() {
      // 一次动画结束，队列存在待播放动画则出队一个动画并播放
      if (!this.isAniming && this.donateQueue.length) {
        const url = this.donateQueue.shift();
        this.createAnim(url);
      }
    },
  },

  methods: {
    // 初始化
    initDonateAnimation() {
      this.clearAnimation();
      this.parser = null;
      this.player = null;
      this.donateQueue = [];
      this.isAniming = false;
    },

    // 处理打赏socket消息
    handleRewardSocket(event, data) {
      const gimg = data.content?.gimg;
      const a = document.createElement('a');
      a.href = gimg;
      const paths = a.pathname.split('/');
      const key = paths[paths.length - 1].split('.')[0];
      this.pushQueue(key);
    },

    // 创建动画播放器
    createPlayer() {
      this.parser = new SVGA.Parser('#donateAnimation');
      this.player = new SVGA.Player('#donateAnimation');
    },

    // 向动画队列入队一个动画
    pushQueue(key) {
      if (!svgas[key]) { return; }
      const oldLength = this.donateQueue.length;
      const currentSvga = BASE_URL + svgas[key];
      this.donateQueue.push(currentSvga);
      if (!this.isAniming && !oldLength) {
        const url = this.donateQueue.shift();
        this.createAnim(url);
      }
    },

    // 加载svga文件
    loadSvgaFile(url) {
      if (!loadSvgasPromise[url]) {
        loadSvgasPromise[url] = new Promise((resolve, reject) => {
          try {
            this.parser.load(url, (videoItem) => {
              resolve(videoItem);
            });
          } catch (e) {
            reject(e);
          }
        });
      }
      return loadSvgasPromise[url];
    },

    // 销毁动画
    clearAnimation() {
      try {
        if (this.player) {
          this.player.clear();
          this.player.clearDynamicObjects();
        }
      } catch (e) {
        console.warn('清除动画失败');
      }
    },

    createAnim(url) {
      this.$nextTick(async () => {
        this.clearAnimation();

        try {
          this.isAniming = true;
          const videoItem = await this.loadSvgaFile(url);
          // 设置循环次数
          this.player.loops = 1;
          // 设置播放器文件
          this.player.setVideoItem(videoItem);
          // 开始播放动画
          this.player.startAnimation();
          // 侦听播放结束，播放下一个动画
          this.player.onFinished(() => {
            this.isAniming = false;
          });
        } catch (e) {
          this.isAniming = false;
        }
      });
    }
  }
};
