// @file 监听窗口尺寸改变事件，判断是否为输入法打开或收起
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
    window.addEventListener('resize', (e) => {
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
