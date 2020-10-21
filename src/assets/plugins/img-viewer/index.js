import ImgViewerComponent from './ImgViewer.vue';

export default {
  install: (Vue) => {
    const ImgViewerConstructor = Vue.extend(ImgViewerComponent);

    const previewImage = (url) => {
      const instance = new ImgViewerConstructor({
        propsData: {
          url
        }
      });
      instance.$mount();
    };
    Vue.prototype.$previewImage = previewImage;
  }
};
