<template>
  <ul class="c-setting-select">
    <li
      v-for="(item, index) in list"
      :key="index"
      :class="[
        'c-setting-select__btn',
        item.value === active ? 'c-setting-select__btn--selected' : ''
      ]"
      @click="$emit('change', item)">{{ item.name }}</li>
  </ul>
</template>

<script>
export default {
  props: {
    active: [String, Number],
    list: Array
  }
};
</script>

<style>
.c-setting-select {
  padding: 32px 0;
  margin: 0;
}
.c-setting-select__btn {
  display: inline-block;
  width: 66px;
  height: 26px;
  line-height: 26px;
  border-radius: 13px;
  margin-left: 15px;
  margin-right: 15px;
  text-align: center;
  color: #fff;
  font-size: 14px;
}
.c-setting-select__btn.c-setting-select__btn--selected {
  border: 1px solid #FFC815;
  color: #FFC815;
}
.c-setting-select__btn:last-of-type {
  margin-right: 0;
}
</style>
