import { escapeHTML } from '@utils/string';
import { isWeixin, isMobile, getWeixinVersion, compareVersions } from '../../assets/utils/browser';

export default {
  data() {
    return {
      isMobile: isMobile(),
      isWeixin: isWeixin(),
      isHighWeixinVersion: compareVersions(getWeixinVersion(), '7.0.12') >= 0
    };
  },

  props: {
    good: Object
  },

  watch: {
    wxTagHtml: {
      immediate: true,
      handler: function() {
        this.$nextTick(() => {
          if (this.isWeixinBtn && this.$refs.wxbtn) {
            this.$refs.wxbtn.innerHTML = this.wxTagHtml;
          }
        });
      }
    }
  },

  methods: {
    getBtnHtml(good, size = {}) {
      return `
        <wx-open-launch-weapp username="${escapeHTML(good.wxMiniprogramOriginalId)}" path="${escapeHTML(good.wxMiniprogramLink)}">
          <script type="text/wxtag-template">
            <style>.c-product-wx-buy-btn {width: ${size.width};height: ${size.height};}</style>
            <div class="c-product-wx-buy-btn"></div>
          </script>
        </wx-open-launch-weapp>
      `;
    }
  },

  computed: {
    linkType() {
      return Number(this.good.linkType || 10);
    },
    btnLink() {
      const { link, pcLink, mobileLink } = this.good;
      if (this.linkType === 10) { return link; }
      if (this.isMobile) { return mobileLink; }
      return pcLink;
    },
    isWeixinBtn() {
      return this.isWeixin && this.good.wxMiniprogramOriginalId && this.isHighWeixinVersion;
    },
    isDisabled() {
      const { link, pcLink, mobileLink } = this.good;
      if (this.linkType === 10) return !link;
      if (this.isWeixinBtn) return false;
      if (this.isMobile) return !mobileLink;
      if (!pcLink) return true;
      return false;
    }
  }
};
