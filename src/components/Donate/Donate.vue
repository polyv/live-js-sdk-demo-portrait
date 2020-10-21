<template>
  <popper
    swiper-to-close
    title="礼物"
    v-if="donateGoodEnabled"
    v-model="visible">
    <div class="c-donate">
      <ul class="c-donate__good">
        <template v-for="(item, index) in goods">
          <li
            class="c-donate__good__item"
            :class="{
              'c-donate__good__item--selected': currentIndex === index
            }"
            :key="index"
            v-if="ynToBool(item.goodEnabled)"
            @click="handleCurrentGood(index)">
            <img
              class="c-donate__good__img"
              :src="item.goodImg" />
            <span class="c-donate__good__name">{{ item.goodName }}</span>
            <div
              v-if="currentIndex === index"
              class="c-donate__good__btn"
              @click.stop="handleGoodDonate(item)">打赏</div>
          </li>
        </template>
      </ul>
    </div>
  </popper>
</template>

<script>
import debounce from 'lodash-es/debounce';
import { bus, DONATE_VISIABLE } from '../../assets/utils/event-bus';
import channelBaseMixin from '../../assets/mixins/channel-base';
import donateApi from '../../assets/api/donate';
import Popper from '../Popper/Popper';

export default {
  mixins: [channelBaseMixin],

  data() {
    return {
      visible: false,
      currentIndex: ''
    };
  },

  components: {
    Popper
  },

  watch: {
    visible() {
      this.currentIndex = '';
    },
  },

  computed: {
    goods() {
      return this.channel?.donateSetting?.goods || [];
    }
  },

  methods: {
    handleVisible(visible) {
      this.visible = visible;
    },
    handleCurrentGood(index) {
      this.currentIndex = index;
    },
    // 发送打赏消息
    handleGoodDonate: debounce(function(item) {
      this.sendDonate(item);
    }, 200),
    async sendDonate(item) {
      const data = {
        donateType: 'good',
        content: item.goodName,
        goodImage: item.goodImg,
      };
      await donateApi.sendDonateMsg(data);
      this.visible = false;
    }
  },

  mounted() {
    bus.$on(DONATE_VISIABLE, this.handleVisible);
  },
  beforeDestroy() {
    bus.$off(DONATE_VISIABLE, this.handleVisible);
  }
};
</script>

<style>
.c-donate {
  width: 100%;
}
.c-donate__good {
  padding: 8px 7px 16px 8px;
  list-style: none;
  margin: 0;
}
.c-donate__good__item {
  display: inline-flex;
  width: 20%;
  height: 98px;
  box-sizing: border-box;
  padding-top: 8px;
  align-items: center;
  flex-direction: column;
  color: #D0D0D0;
  font-size: 12px;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  transition: .3s;
}
.c-donate__good__item.c-donate__good__item--selected {
  background: #3E3E4E;
}
.c-donate__good__img {
  width: 48px;
  height: 48px;
  object-fit: cover;
}
.c-donate__good__name {
  color: #D0D0D0;
  margin-bottom: 4px;
}
.c-donate__good__btn {
  height: 24px;
  line-height: 24px;
  background: #FFA611;
  color: #fff;
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  text-align: center;
}
</style>
