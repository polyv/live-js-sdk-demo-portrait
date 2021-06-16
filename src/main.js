import './assets/style/basic.css';
import './assets/style/icons.css';
import { ynToBool } from '@utils/boolean';
import { updateConfig } from './assets/utils/config';
import { checkParams } from './assets/utils/utils';
import responsivePlugin from './assets/plugins/responsive';
import imgViewer from './assets/plugins/img-viewer';
import directives from './assets/directives/index';
import PortraitView from './portrait-view/portrait-view';

export default {
  install: (Vue, config = {}) => {
    // 更新app信息
    const { appId, appSecret, verifyUrl, channelId, user, vid, vodType } = config;
    checkParams(config, ['appId', 'channelId', 'user']);
    checkParams(config.user, ['userId', 'userName']);
    updateConfig({ appId, appSecret, verifyUrl, channelId, user, vid, vodType });

    // 全局混入
    Vue.mixin({
      methods: {
        ynToBool,
        resizeImg(url, width, height) {
          let a = document.createElement('a');
          a.href = url;

          const host = a.host.toLowerCase();
          const search = a.search;
          a = null;

          if (host !== 'liveimages.videocc.net' || search) { return url; }

          let result = url + '?x-oss-process=image/resize,mfit';
          if (width) { result += ',w_' + width; }
          if (height) { result += ',h_' + height; }
          result += ',limit_1';
          return result;
        },
      }
    });

    // 设备插件
    Vue.use(responsivePlugin);
    // 全局指令
    Vue.use(directives);
    // 图片浏览
    Vue.use(imgViewer);
    // 引入组件
    Vue.component(PortraitView.name, PortraitView);
  }
};
