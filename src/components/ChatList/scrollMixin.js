import debounce from 'lodash-es/debounce';

// 和滚动有关的mixin
export default {
  data() {
    return {
      prevScrollDom: null, // 加载下一页时，当前最顶层的元素
    };
  },

  computed: {
    isScrollBottom() {
      return this.$refs?.scroll?.isScrollBottom;
    },
    isScrollTop() {
      return this.$refs?.scroll?.isScrollTop;
    }
  },

  methods: {
    // 滚到最底层
    scrollToBottom(force = false) {
      this.$nextTick(() => {
        this.$refs.scroll.scrollToBottom();
        this.newTipsVisible = false;
      });
    },

    // 滚到上一页时最顶层的元素
    scrollToPrevDom() {
      this.$nextTick(() => {
        if (this.prevScrollDom) {
          this.$refs.scroll.scrollToElement(this.prevScrollDom);
          this.prevScrollDom = null;
        }
      });
    },

    // 处理滚动到最顶，加载下一页
    handleScrollTop: debounce(function() {
      if (this.isNoMore) return;
      const chatListDom = document.querySelector('.c-chat-list__content');

      // 记录当前第一个dom元素，在加载渲染完后滚到第一个元素做无痕
      if (chatListDom.childNodes.length) {
        this.prevScrollDom = chatListDom.childNodes[0];
      }
      this.loadHistory();
    }, 200),

    handleScrollBottom() {
      this.newTipsVisible = false;
    }
  }
};
