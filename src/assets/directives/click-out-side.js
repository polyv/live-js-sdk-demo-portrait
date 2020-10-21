/**
 * 元素外部点击事件
 */
const ctx = '@@clickoutsideContext';

export default {
  bind(el, binding) {
    const handleDocumentClick = (e) => {
      if (el.contains(e.target)) return;
      binding.value(e);
    };
    el[ctx] = handleDocumentClick;
    document.addEventListener('mouseup', handleDocumentClick);
  },

  unbind(el) {
    document.removeEventListener('mouseup', el[ctx]);
    delete el[ctx];
  },
};
