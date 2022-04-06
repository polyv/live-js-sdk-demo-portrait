import Carousel from './src/carousel-render';

Carousel.install = function(Vue) {
  Vue.component(Carousel.name, Carousel);
};

export default Carousel;
