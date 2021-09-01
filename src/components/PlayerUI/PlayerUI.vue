<template>
  <div class="c-playui">
    <!-- 只看主持人、音频切换、线路切换 -->
    <player-setting :channel="channel" :playerCtrl="playerCtrl" />
  </div>
</template>

<script>
// 所有有关播放器操作都到PlayerUI处理
import PlayerSetting from './components/PlayerSetting';
import channelBaseMixin from '../../assets/mixins/channel-base';

export default {
  mixins: [channelBaseMixin],

  components: {
    PlayerSetting,
  },

  props: {
    channel: Object,
    playerCtrl: null,
  }
};
</script>
