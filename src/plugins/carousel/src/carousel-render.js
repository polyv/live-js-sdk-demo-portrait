import MouseMixin from './mixins/mouse-mixin';
import { setAnimationClocker, removeAnimationClocker } from './utils/utils';
import SlotRender from './utils/slot-render';
import './carousel.css';

export default {
  name: 'plv-carousel',

  data() {
    return {
      activeIndex: 0,
      translateX: 0,
      translateY: 0,

      wrapWidth: 0,
      wrapHeight: 0,

      animationClocker: undefined, // 动画定时器
      autoplayTimer: undefined,
      itemClones: [], // boolean[]
    };
  },

  mixins: [MouseMixin],

  provide() {
    return {
      carousel: this,
    };
  },

  props: {
    slideIndex: {
      type: Number,
      default: 0,
    },
    autoplay: {
      type: Boolean,
      default: false,
    },
    interval: {
      type: Number,
      default: 3000,
    },
    loop: {
      type: Boolean,
      default: false,
    },
    // horizontal, vertical
    direction: {
      type: String,
      default: 'horizontal',
    },
    touchAngle: {
      type: Number,
      default: 45,
    },
  },

  computed: {
    contentStyle() {
      const style = {
        transform: `translate(${this.translateX}px, ${this.translateY}px)`,
      };

      switch (this.direction) {
        case 'horizontal': {
          style.width = `${this.renderItems.length * this.wrapWidth}px`;
          break;
        }
        case 'vertical': {
          style.height = `${this.renderItems.length * this.wrapHeight}px`;
          break;
        }
      }

      return style;
    },
    isLoop() {
      return this.loop;
    },
    isAutoPlay() {
      return this.autoplay;
    },
    carouselItemSlots() {
      const defaultSlots = [...this.$slots.default];
      return defaultSlots.filter(vm => {
        return vm.tag && vm.tag.indexOf('plv-carousel-item') !== -1;
      }).map((vm, index) => {
        vm._slideIndex = index;
        return vm;
      });
    },
    // 用于渲染的 items
    renderItems() {
      const defaultSlots = [...this.carouselItemSlots];
      const defaultSlotsLen = defaultSlots.length;
      const itemClones = [];
      const renders = [...defaultSlots].map(vm => {
        itemClones.push(false);
        return vm;
      });

      if (this.isLoop) {
        const prefixCloneItem = defaultSlots[defaultSlotsLen - 1];
        renders.unshift(prefixCloneItem);
        itemClones.unshift(true);

        const suffixCloneItem = defaultSlots[0];
        renders.push(suffixCloneItem);
        itemClones.push(true);
      }
      this.itemClones = itemClones;
      return renders;
    },

    currentTranslate() {
      if (this.direction === 'vertical') {
        return this.translateY;
      }
      return this.translateX;
    },
  },

  watch: {
    activeIndex() {
      const slideIndex = this.getSlideIndex();
      if (this.slideIndex !== slideIndex) {
        this.$emit('update:slideIndex', slideIndex);
        this.$emit('change', slideIndex);
      }
    },
    slideIndex() {
      const slideIndex = this.getSlideIndex();
      if (this.slideIndex !== slideIndex) {
        this.slideTo(this.slideIndex);
      }
    },
  },

  mounted() {
    this.setWrapSize();
    this.slideTo(this.slideIndex, false);
    this.isAutoPlay && this.startAutoPlay();

    window.addEventListener('resize', this.handleWindowReszie);
  },

  beforeDestroy() {
    this.clearAnimationClocker();
    this.removeAutoPlay();
    window.removeEventListener('resize', this.handleWindowReszie);
  },

  methods: {
    isHorizontal() {
      return this.direction === 'horizontal';
    },
    isVertical() {
      return this.direction === 'vertical';
    },

    setWrapSize() {
      this.wrapWidth = this.$el.clientWidth;
      this.wrapHeight = this.$el.clientHeight;
    },

    handleWindowReszie() {
      this.setWrapSize();
      this.slideToActive(this.activeIndex, false);
    },

    // 获取当前 actievIndex 的 slideIndex
    getSlideIndex() {
      const activeIndex = this.activeIndex;
      const vm = this.renderItems[activeIndex];
      return vm._slideIndex;
    },

    // 自动切换
    startAutoPlay() {
      this.removeAutoPlay();
      this.autoplayTimer = window.setTimeout(() => {
        this.slideNext();
      }, this.interval);
    },
    removeAutoPlay() {
      if (this.autoplayTimer) {
        clearTimeout(this.autoplayTimer);
        this.autoplayTimer = undefined;
      }
    },

    resetSlide() {
      const activeIndex = this.activeIndex;
      const vm = this.renderItems[activeIndex];
      const slideIndex = vm._slideIndex;
      const isClone = !!this.itemClones[activeIndex];
      if (isClone) {
        // 当前所在的 activeIndex 是被克隆的，切到本体 item
        this.slideTo(slideIndex, false);
      }
      return slideIndex;
    },

    slidePrev() {
      this.slideToActive(this.activeIndex - 1);
    },
    slideNext() {
      this.slideToActive(this.activeIndex + 1);
    },
    slideTo(index, transition = true) {
      if (index < 0) {
        index = 0;
      }
      if (index > this.carouselItemSlots.length - 1) {
        index = this.carouselItemSlots.length - 1;
      }
      let toIndex = -1;
      this.renderItems.map((vm, i) => {
        const isClone = this.itemClones[i];
        if (!isClone && vm._slideIndex === index) {
          toIndex = i;
        }
      });
      this.slideToActive(toIndex, transition);
    },

    setTranslate(num) {
      if (this.direction === 'vertical') {
        this.translateY = num;
        return;
      }
      this.translateX = num;
    },

    getItemSize() {
      if (this.direction === 'vertical') {
        return this.wrapHeight;
      }
      return this.wrapWidth;
    },

    slideToActive(index, transition = true) {
      if (index < 0) {
        index = 0;
      }
      if (index > this.renderItems.length - 1) {
        index = this.renderItems.length - 1;
      }

      this.activeIndex = index;

      this.clearAnimationClocker();

      const itemSize = this.getItemSize();
      const translateEnd = index * itemSize * -1;

      if (!transition) {
        this.setTranslate(translateEnd);
        this.isAutoPlay && this.startAutoPlay();
        this.resetSlide();
        return;
      }

      // 开始执行动画
      this.isTransition = true;
      const moveSpeed = Math.abs(Math.abs(translateEnd) - Math.abs(this.currentTranslate)) / 16;

      const doAnimation = () => {
        const diff = this.currentTranslate > translateEnd ? -1 * moveSpeed : moveSpeed;
        let _translate = this.currentTranslate + diff;

        if (Math.abs(_translate - translateEnd) < moveSpeed) {
          _translate = translateEnd;
        }

        this.setTranslate(_translate);

        // 动画已达到终点
        if (this.currentTranslate === translateEnd) {
          this.clearAnimationClocker();
          this.resetSlide();
          this.isAutoPlay && this.startAutoPlay();
          return;
        }

        this.animationClocker = setAnimationClocker(() => {
          doAnimation();
        });
      };

      doAnimation();
    },

    // 清除动画定时器
    clearAnimationClocker() {
      if (this.animationClocker) {
        removeAnimationClocker(this.animationClocker);
        this.animationClocker = undefined;
      }
      this.isTransition = false;
    },
  },

  render() {
    let prevArrow;
    if (this.$slots.prevArrow) {
      prevArrow = <div class="plv-carousel__prev-arrow" onClick={this.slidePrev}>{ this.$slots.prevArrow }</div>;
    }

    let nextArrow;
    if (this.$slots.nextArrow) {
      nextArrow = <div class="plv-carousel__next-arrow" onClick={this.slideNext}>{ this.$slots.nextArrow }</div>;
    }

    let indicator;
    if (this.$slots.indicator || this.$scopedSlots.indicator) {
      indicator = (
        <SlotRender
          slotName="indicator"
          scopedData={{
            count: this.carouselItemSlots.length,
            slideIndex: this.getSlideIndex(),
            slideTo: this.slideTo,
          }}
          target={this}
          className="plv-carousel__indicator"
        />
      );
    }

    return (
      <div
        class={{
          'plv-carousel': true,
          'plv-carousel--vertical': this.direction === 'vertical',
        }}
      >
        <div
          ref="content"
          class="plv-carousel__content"
          style={this.contentStyle}
          onMousedown={this.handleMouseDown}
          onMousemove={this.handleMouseMove}
          onMouseup={this.handleMouseUp}
          onTouchstart={this.handleTouchStart}
          onTouchmove={this.handleTouchMove}
          onTouchend={this.hadnleTouchEnd}
          onTouchcancel={this.hadnleTouchEnd}
        >
          { this.renderItems }
        </div>

        { prevArrow }

        { nextArrow }

        { indicator }
      </div>
    );
  },
};
