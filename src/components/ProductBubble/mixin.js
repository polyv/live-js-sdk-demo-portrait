export default {
  data() {
    return {
      bubbleVisible: false,
      visibleTimer: null,
      goodInfo: {
        showId: '',
        productId: '',
        cover: '',
        name: '',
        price: '',
        realPrice: '',
        rank: '',
        link: '',
        pcLink: '',
        moblieLink: '',
        wxMiniprogramOriginalId: '',
        wxMiniprogramLink: '',
      }
    };
  },

  methods: {
    addNumber() {
      this.$set(this.goodInfo, 'showId', this.goodInfo.showId + 1);
    },
    reduceNumber() {
      this.$set(this.goodInfo, 'showId', this.goodInfo.showId - 1);
    },

    // 操作1 - 上架商品
    handleOnShelfProduct(data) {
      if (data.rank < this.goodInfo.rank) {
        this.addNumber();
      }
    },

    // 操作2 - 下架商品
    // 操作3 - 删除商品
    handleOffShelfAndDel(data) {
      if (data.productId === this.goodInfo.productId) {
        this.close();
      }
      if (data.rank > this.goodInfo.rank) {
        this.addNumber();
      } else {
        this.reduceNumber();
      }
    },

    // 操作4 - 添加商品
    handleAddProduct(data) {
      if (data.status !== 1) return;
      this.reduceNumber();
    },

    // 操作5 - 编辑商品
    handleEditProduct(data) {
      if (data.productId === this.goodInfo.productId) {
        this.goodInfo = data;
      }
    },

    // 操作6 - 上移商品
    // 操作7 - 下移商品
    handleMoveProduct(data) {
      const findIndex = data.findIndex(item => item.productId === this.goodInfo.productId);
      if (findIndex === -1) { return; }
      this.goodInfo = data[findIndex];
    },

    // 操作9 - 推送消息
    handleBubbleVisible(data) {
      clearTimeout(this.visibleTimer);
      this.visibleTimer = null;
      this.goodInfo = data;
      this.$nextTick(() => {
        this.bubbleVisible = true;
      });
    },

    // 分配socket消息
    handleProductMsg(msg) {
      const status = Number(msg.status);

      if (status === 9) {
        this.handleBubbleVisible(msg.content);
        return;
      }

      if (!this.bubbleVisible) { return; }

      switch (status) {
        case 1:
          this.handleOnShelfProduct(msg.content);
          break;
        case 2:
        case 3:
          this.handleOffShelfAndDel(msg.content);
          break;
        case 4:
          this.handleAddProduct(msg.content);
          break;
        case 5:
          this.handleEditProduct(msg.content);
          break;
        case 6:
        case 7:
          this.handleMoveProduct(msg.content);
          break;
        default:
          break;
      }
    },

    close() {
      this.bubbleVisible = false;
      clearTimeout(this.visibleTimer);
      this.visibleTimer = null;
    },

    setCloseTime() {
      this.visibleTimer = setTimeout(() => {
        this.close();
      }, 5 * 1000);
    },
  }
};
