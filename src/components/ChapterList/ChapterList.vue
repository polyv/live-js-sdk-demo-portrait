<template>
  <popper
    title="章节"
    v-model="visible"
    height="400px">
    <ul class="c-chapter-list__content">
      <li
        v-for="item in chapterList"
        :key="item.id"
        class="c-chapter-list__item"
        :class="{
          'c-chapter-list__item--active': curChapterId === item.id
        }"
        @click="handleClickChapter(item)">
        <i
          :class="[
            curChapterId === item.id ? 'i-chapter-active' : 'i-chapter',
            'c-chapter-list__item__icon',
            'g-img-cover'
          ]"></i>
        <p class="c-chapter-list__item__title g-singleline">{{ item.title }}</p>
        <span class="c-chapter-list__item__time">{{ item.time | formatSecondsStr }}</span>
      </li>
    </ul>
  </popper>
</template>

<script>
import { CHAPTER_VISIBLE, bus } from '../../assets/utils/event-bus';
import Popper from '../Popper/Popper';
import { formatSeconds } from '@polyv/utils/src/date';
import PlayEvents from '../../assets/live-sdk/player-evt';

export default {
  data() {
    return {
      visible: false,
      curChapterId: null
    };
  },

  filters: {
    formatSecondsStr(time) {
      return formatSeconds(time);
    },
  },

  props: {
    chapterList: {
      type: Array
    },
    playerCtrl: {
      type: Object
    }
  },

  watch: {
    playerCtrl: {
      immediate: true,
      handler() {
        this.playerCtrl && this.playerCtrl.on(PlayEvents.TIME_UPDATE, this.handleTimeUpdate);
      },
    },
  },

  components: {
    Popper
  },

  methods: {
    handleVisible(visible) {
      this.visible = visible;
    },
    handleTimeUpdate(evt) {
      const time = evt.currentTime;
      const len = (this.chapterList?.length) || 0;
      const currentTime = Math.floor(time);

      // 时间倒叙寻找能当前能匹配到的最后一个章节
      for (let i = len - 1; i >= 0; i--) {
        if (currentTime >= this.chapterList[i].time) {
          this.curChapterId = this.chapterList[i].id;
          break;
        }
      }
    },
    async handleClickChapter(chapter) {
      if (chapter.id === this.curChapterId || !this.playerCtrl) { return; }
      this.visible = false;
      try {
        this.playerCtrl.resume();
        await this.playerCtrl.waitForPositivePlay();
        this.playerCtrl.seek(chapter.time);
      } catch (e) {}
      this.curChapterId = chapter.id;
    }
  },

  mounted() {
    bus.$on(CHAPTER_VISIBLE, this.handleVisible);
  },

  beforeDestroy() {
    bus.$off(CHAPTER_VISIBLE, this.handleVisible);
  }
};
</script>

<style>
.c-chapter-list__content {
  position: absolute;
  top: 55px;
  width: 100%;
  left: 0;
  right: 0;
  bottom: 0;
  box-sizing: border-box;
  overflow-y: scroll;
  padding: 0;
  margin: 0;
}
.c-chapter-list__item {
  height: 60px;
  line-height: 60px;
  border-bottom: 1px solid rgba(255, 255, 255, .4);
  padding: 0 16px;
  position: relative;
  color: rgba(255, 255, 255, .8);
  display: flex;
  align-items: center;
  font-size: 14px;
}
.c-chapter-list__item:last-of-type {
  border-bottom: none;
}
.c-chapter-list__item.c-chapter-list__item--active {
  color: #FFD16B;
}
.c-chapter-list__item__icon {
  width: 24px;
  height: 24px;
  display: inline-block;
  margin-right: 16px;
}
.c-chapter-list__item__title {
  flex: 1;
}
.c-chapter-list__item__time {
  margin-left: 16px;
}
</style>
