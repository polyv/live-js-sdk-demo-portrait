<template>
  <div class="c-playui">
    <!-- 音频切换、线路切换 -->
    <player-setting :channel="channel" />
  </div>
</template>

<script>
// 所有有关播放器操作都到PlayerUI处理
import PlayerSetting from './components/PlayerSetting';
import playerCommonMixin from '../../assets/mixins/player-common';

export default {
  mixins: [playerCommonMixin],

  components: {
    PlayerSetting,
  },

  props: {
    channel: Object,
  }
};
</script>
