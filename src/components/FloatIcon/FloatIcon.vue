<template>
  <div class="c-float-icon">
    <template v-for="item in iconList">
      <heart-icon
        :key="item.id"
        :type="item.type"
        @close="handleHeartClose(item.id)" />
    </template>
  </div>
</template>

<script>
import HeartIcon from './HeartIcon';
import { getRandom } from '../../assets/utils/utils';

// const hearts = ['red', 'red', 'red', 'red'];
const hearts = ['red', 'green', 'blue', 'orange'];

export default {
  data() {
    return {
      heartNumber: 0,
      iconList: [],
    };
  },

  components: {
    HeartIcon
  },

  methods: {
    add() {
      const id = getRandom(0, 999999999);
      this.iconList.push({
        id,
        type: hearts[this.heartNumber]
      });
      this.heartNumber++;
      if (this.heartNumber > 3) {
        this.heartNumber = 0;
      }
    },
    handleHeartClose(id) {
      this.iconList = this.iconList.filter(item => item.id !== id);
    }
  }
};
</script>

<style>
.c-float-icon {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
