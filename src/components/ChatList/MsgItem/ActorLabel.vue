<template>
  <div
    class="c-actor-label"
    :style="labelStyle">
    <span ref="labelContent">{{ actor }}</span>
  </div>
</template>

<script>
const actorColor = {
  manager: '#33BBC5',
  assistant: '#598FE5',
  teacher: '#F09343',
  guest: '#EB6165'
};

export default {
  data() {
    return {
      width: 0
    };
  },

  props: {
    actor: String,
    userType: String
  },

  watch: {
    actor: {
      immediate: true,
      handler() {
        this.setLabelWidth();
      }
    }
  },

  computed: {
    actorColor() {
      return this.userType ? actorColor[this.userType] : '';
    },
    labelStyle() {
      return {
        width: `${this.width}px`,
        background: this.actorColor
      };
    }
  },

  methods: {
    setLabelWidth() {
      this.$nextTick(() => {
        const width = this.$refs.labelContent.offsetWidth;
        this.width = (width * 0.75) + 10;
      });
    }
  }
};
</script>

<style>
.c-actor-label {
  font-size: 12px;
  color: #fff;
  margin-right: 4px;
  border-radius: 6px;
  float: left;
  height: 12px;
  line-height: 12px;
  position: relative;
  top: 3px;
  vertical-align: middle;
  display: flex;
  justify-content: center;
  align-items: center;
}
.c-actor-label span {
  display: inline-block;
  transform: scale(.75, .75);
  word-break: keep-all;
  flex-shrink: 0;
}
</style>
