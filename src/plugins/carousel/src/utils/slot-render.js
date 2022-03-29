export function slotRender(vm, slotName, data = {}) {
  const scopedSlots = vm.$scopedSlots[slotName];
  const slots = vm.$slots[slotName];
  if (scopedSlots) {
    return scopedSlots(data);
  }
  if (slots) {
    return slots;
  }
  return null;
}

/**
 * slot插槽渲染组件
 */
export default {
  props: {
    // 渲染的slot名称
    slotName: {
      type: String,
      default: 'default'
    },
    // 插槽传入的参数
    scopedData: Object,
    // vm对象
    target: Object,
    // 外层dom的class名称
    className: [String, Array],
    // 外层标签名
    tagName: {
      type: String,
      default: 'div'
    }
  },

  computed: {
    renderSlot() {
      const { slotName } = this;
      const scopedSlots = this.target.$scopedSlots[slotName];
      const slots = this.target.$slots[slotName];
      return scopedSlots || slots ? (h, data) => {
        return scopedSlots ? scopedSlots(data) : slots;
      } : () => {};
    },
  },

  render() {
    return (
      <this.tagName class={ this.className }>
        { this.renderSlot(this.$createElement, this.scopedData) }
      </this.tagName>
    );
  }
};
