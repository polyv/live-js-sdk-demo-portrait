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

<style lang="scss">
.c-actor-label {
  font-size: 14px;
  color: #fff;
  margin-right: 4px;
  border-radius: 9px;
  float: left;
  height: 18px;
  line-height: 18px;
  position: relative;
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
