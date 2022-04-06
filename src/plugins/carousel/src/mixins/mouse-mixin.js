import { isMobile } from '@polyv/utils/dist/browser';

export default {
  data() {
    return {
      isMobile: isMobile(),

      isDragDown: false, // 是否按下了拖拽
      startDragTime: undefined, // 开始拖拽的时间戳
      startDragPotision: undefined, // 开始拖拽的坐标 { x, y }
      preDragPosition: undefined, // 上一刻拖拽的坐标 { x, y }

      isTransition: false, // 是否正在过渡中

      moveThreshold: 15, // 滑动距离阀值
      timeThreshold: 300, // 滑动时间阀值

      isScrolling: undefined,
    };
  },

  mounted() {
    document.body.addEventListener('mouseup', this.handleMouseUp);
    document.body.addEventListener('mouseleave', this.handleMouseUp);
  },

  beforeDestroy() {
    document.body.removeEventListener('mouseup', this.handleMouseUp);
    document.body.removeEventListener('mouseleave', this.handleMouseUp);
  },

  methods: {
    // ============= mouse =============
    handleMouseDown(event) {
      if (this.isMobile) {
        return;
      }

      this.onDragStart({
        x: event.clientX,
        y: event.clientY,
      });
    },
    handleMouseMove(event) {
      if (this.isMobile) {
        return;
      }

      this.onDragMove({
        x: event.clientX,
        y: event.clientY,
      });
    },
    handleMouseUp() {
      if (this.isMobile) {
        return;
      }

      this.onDragEnd();
    },

    // ============= touch =============
    handleTouchStart(event) {
      if (!this.isMobile) {
        return;
      }

      this.isScrolling = undefined;

      const touch = event.touches[0];
      this.onDragStart({
        x: touch.pageX,
        y: touch.pageY,
      });
    },
    handleTouchMove(event) {
      if (!this.isMobile) {
        return;
      }

      const touch = event.touches[0];
      const position = {
        x: touch.pageX,
        y: touch.pageY,
      };

      if (this.preDragPosition) {
        const { x: preX, y: preY } = this.preDragPosition;
        const { x: nowX, y: nowY } = position;
        const diffY = nowY - preY;
        const diffX = nowX - preX;

        if (typeof this.isScrolling === 'undefined') {
          if (
            (this.isHorizontal() && nowY === preY) ||
            (this.isVertical() && nowX === preX)
          ) {
            this.isScrolling = false;
          } else {
            const touchAngle = (Math.atan2(Math.abs(diffY), Math.abs(diffX)) * 180) / Math.PI;
            this.isScrolling = this.isHorizontal() ?
              touchAngle > this.touchAngle :
              90 - touchAngle > this.touchAngle;
          }
        }

        if (this.isScrolling) {
          return;
        }
      }

      event.preventDefault();
      this.onDragMove(position);
    },
    hadnleTouchEnd(event) {
      if (!this.isMobile) {
        return;
      }

      this.onDragEnd();
    },

    // ============= drag =============
    onDragStart(position) {
      if (this.isTransition) {
        return;
      }

      this.isDragDown = true;
      this.startDragPosition = position;
      this.preDragPosition = position;
      this.startDragTime = Date.now();
    },
    onDragMove(position) {
      if (this.isTransition) {
        return;
      }
      if (!this.isDragDown) {
        return;
      }

      if (this.preDragPosition) {
        const { x: preX, y: preY } = this.preDragPosition;
        const { x: nowX, y: nowY } = position;
        const diffY = nowY - preY;
        const diffX = nowX - preX;

        if (this.direction === 'vertical') {
          this.translateY += diffY;
        } else {
          this.translateX += diffX;
        }
      }

      this.preDragPosition = position;
    },
    onDragEnd() {
      if (this.isTransition) {
        return;
      }
      if (!this.isDragDown) {
        return;
      }

      const direction = this.checkSlide();

      switch (direction) {
        case 'pre':
          this.slidePrev();
          break;
        case 'next':
          this.slideNext();
          break;
        default:
          this.slideToActive(this.activeIndex);
      }

      this.isDragDown = false;
      this.startDragTime = undefined;
      this.startDragPotision = undefined;
      this.preDragPosition = undefined;
    },

    checkSlide() {
      const { startDragPosition, startDragTime, preDragPosition } = this;
      if (!startDragPosition || !startDragTime || !preDragPosition) {
        return;
      }

      // 滑动的时间
      const moveTime = Date.now() - startDragTime;
      // 滑动的距离
      let moveDiff = preDragPosition.x - startDragPosition.x;
      // 节点尺寸
      const itemSize = this.getItemSize();
      if (this.direction === 'vertical') {
        moveDiff = preDragPosition.y - startDragPosition.y;
      }

      // 条件1 - 滑动距离大于节点尺寸的一半
      const rule1 = Math.abs(moveDiff) > itemSize / 2;
      // 条件2 - 滑动超出阀值
      const rule2 = Math.abs(moveDiff) >= this.moveThreshold && moveTime <= this.timeThreshold;

      if (rule1 || rule2) {
        return moveDiff <= 0 ? 'next' : 'pre';
      }
    },
  },
};
