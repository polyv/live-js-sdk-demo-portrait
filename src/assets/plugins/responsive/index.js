import {
  bus,
  WINDOW_RESIZE,
  KEYBOARD_SHOW,
  KEYBOARD_HIDE,
} from '../../utils/event-bus';

let windowInnerHeight = window.innerHeight;

export default {
  install: () => {
    // 窗口尺寸改变
    const resizeEvent = 'onorientationchange' in window ? 'orientationchange' : 'resize';
    window.addEventListener(resizeEvent, (e) => {
      // 旋转角度为正负90度，提示竖屏观看
      if (Math.abs(window.orientation) === 90) {
        alert('请使用竖屏观看');
      }

      /**
       * 软键盘事件
       * 以140高度差为界限，判断是否为软键盘展开或收起事件
       */
      const target = e.target;
      if (Math.abs(target.innerHeight - windowInnerHeight) > 140) {
        const keyboardEvent = target.innerHeight > windowInnerHeight ? KEYBOARD_HIDE : KEYBOARD_SHOW;
        bus.$emit(keyboardEvent);
      }
      windowInnerHeight = target.innerHeight;

      bus.$emit(WINDOW_RESIZE, e);
    }, false);
  }
};
