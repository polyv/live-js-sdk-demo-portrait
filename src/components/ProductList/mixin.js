import debounce from 'lodash-es/debounce';
import productApi from '../../assets/api/product';

const debounceTime = 300;

export default {
  data() {
    return {
      total: 0,
      products: [],
      isLoading: false,
      isNoMore: false,
    };
  },

  props: {
    channel: Object
  },

  computed: {
    channelId() {
      return this.channel?.channelId;
    }
  },

  methods: {
    init() {
      this.isLoading = false;
      this.isNoMore = false;
      this.getProductList(true);
    },

    // 处理列表排序、去重
    handleProducts(products) {
      if (!products.length) return [];
      const pIds = {};
      const newProducts = products.filter((good) => {
        // 去重
        if (pIds[good.productId]) { return false; }
        pIds[good.productId] = true;
        // 去除不在架的商品
        return Number(good.status) === 1;
      });
      // 排序
      newProducts.sort((good1, good2) => {
        return good1.rank > good2.rank ? -1 : 1;
      });
      return newProducts;
    },

    // 获取商品列表
    async getProductList(isFirst = false) {
      if (this.isNoMore || this.isLoading) { return; }

      const params = {};
      if (this.products.length && !isFirst) {
        params.rank = this.products[this.products.length - 1].rank;
      }

      this.isLoading = true;
      try {
        const { data: { total = 0, content = [] } } = await productApi.getProductList(params);
        this.total = total;
        if (isFirst) {
          this.products = content;
          this.$nextTick(() => {
            this.$refs.productWrap && (this.$refs.productWrap.scrollTop = 0);
          });
        } else {
          this.products = [...this.products, ...content];
        }

        if (content.length < 10) {
          this.isNoMore = true;
        }
      } catch (e) {}

      this.$nextTick(() => {
        this.isLoading = false;
      });
    },

    handleScroll: debounce(function(e) {
      // 获取下一页数据
      const target = e.target;
      const scrollHeight = parseInt(target.scrollHeight);
      const scrollTop = parseInt(target.scrollTop);
      const clientHeight = parseInt(target.clientHeight);
      if (scrollTop >= scrollHeight - clientHeight - 50) {
        this.getProductList();
      }
    }, debounceTime),

    // 操作1 - 上架商品
    handleOnShelfProduct(data) {
      this.total++;
      const len = this.products.length;

      if (len === 0) {
        this.products.push(data);
        return;
      }
      // 上架的商品rank小于最后一个
      if (data.rank < this.products[len - 1].rank && this.products.length > 10) {
        this.isNoMore = false;
        return;
      }
      const newProducts = [data, ...this.products];
      newProducts.sort((good1, good2) => {
        return good1.rank > good2.rank ? -1 : 1;
      });
      this.products = newProducts;
    },

    // 操作2 - 下架商品
    // 操作3 - 删除商品
    handleOffShelfAndDel(data) {
      this.total--;
      this.products = this.products.filter(item => item.productId !== data.productId);
      // 滚动条消失时需要获取下一批数据，避免无法滚动
      this.$nextTick(() => {
        const productWrap = this.$refs.productWrap;
        const canScroll = productWrap.scrollHeight > productWrap.clientHeight;
        if (!canScroll) {
          this.getProductList();
        }
      });
    },

    // 操作4 - 添加商品
    handleAddProduct(data) {
      if (data.status !== 1) return;
      this.total++;
      this.products.unshift(data);
    },

    // 操作5 - 编辑商品
    handleEditProduct(data) {
      const index = this.products.findIndex(item => item.productId === data.productId);
      // 在列表里，直接更新
      if (index !== -1) {
        this.$set(this.products, index, data);
      }
    },

    // 操作6 - 上移商品
    // 操作7 - 下移商品
    handleMoveProduct(data) {
      let index1 = -1;
      let index2 = -1;
      for (let i = 0; i < this.products.length; i++) {
        const item = this.products[i];
        if (item.productId === data[0].productId) {
          index1 = i;
        }
        if (item.productId === data[1].productId) {
          index2 = i;
        }
        if (index1 !== -1 && index2 !== -1) {
          break;
        }
      }
      const isInProducts = index1 !== -1 || index2 !== -1;
      if (!isInProducts) { return; }
      const newList = this.handleProducts([...data, ...this.products]);
      this.products = newList;
    },

    handleProductMsg(msg) {
      const status = Number(msg.status);

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
          if (msg.content.length !== 2 && !this.products.length) { return; }
          this.handleMoveProduct(msg.content);
          break;
        default:
          break;
      }
      this.products = this.handleProducts(this.products);
    },
  }
};
