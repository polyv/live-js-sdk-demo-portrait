<template>
  <div class="c-section-panel">
    <div class="c-section-panel__title">
      <i :class="[icon, 'g-icon']"></i>
      <span>{{ title }}</span>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    icon: String,
    title: String
  },
};
</script>

<style>
.c-section-panel {
  border-radius: 10px;
  padding: 15px;
  background: rgba(243, 243, 243, .8);
}
.c-section-panel__title {
  display: flex;
  align-items: center;
  line-height: 16px;
  font-size: 16px;
  color: #333;
  margin-bottom: 15px;
}
.c-section-panel__title .g-icon {
  width: 16px;
  height: 16px;
  margin-right: 8px;
}
</style>
