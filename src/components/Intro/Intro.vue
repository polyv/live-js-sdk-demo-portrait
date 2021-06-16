<template>
  <section-panel
    title="直播介绍"
    class="c-intro"
    icon="i-document-circle">
    <div
      v-if="isEmpty"
      class="c-intro__empty">暂无直播介绍～</div>
    <div
      class="c-intro__html"
      v-else
      v-html="htmlContent"></div>
  </section-panel>
</template>

<script>
import SectionPanel from '../SectionPanel/SectionPanel';
import { htmlStr2Text } from '../../assets/utils/utils';

export default {
  components: {
    SectionPanel
  },

  props: {
    channel: Object
  },

  computed: {
    htmlContent() {
      let menuItem = {};
      for (let i = 0; i < this.channel.channelMenus.length; i++) {
        const item = this.channel.channelMenus[i];
        if (item.menuType === 'desc') {
          menuItem = item;
        }
      }
      return menuItem?.content || '';
    },

    isEmpty() {
      if (!this.htmlContent) return true;

      // 具有以下标签的则不为空
      const labelName = ['img'];
      for (let i = 0; i <= labelName.length; i++) {
        if (this.htmlContent.indexOf(`<${labelName[i]}`) !== -1) {
          return false;
        }
      }

      // 纯文本为空
      const htmlText = htmlStr2Text(this.htmlContent);
      if (!htmlText) return true;
      return false;
    }
  },
};
</script>

<style>
.c-intro {
  margin-bottom: 11px;
}
.c-intro__empty {
  height: 160px;
  line-height: 160px;
  text-align: center;
  font-size: 14px;
}
.c-intro__html {
  word-break: break-word;
  font-size: 14px;
  line-height: 1.4;
}
.c-intro__html p {
  margin: 10px 0;
}
.c-intro__html p:first-child {
  margin-top: 0;
}
.c-intro__html p:last-child {
  margin-bottom: 0;
}
.c-intro__html a {
  color: #3082FE;
}
.c-intro__html img {
  max-width: 100%;
}
</style>
