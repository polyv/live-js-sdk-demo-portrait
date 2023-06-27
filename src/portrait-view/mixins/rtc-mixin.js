import { liveSdk } from '../../assets/live-sdk/live-sdk';
import Toolkit from '../../components/Rtc/RtcTool/index';
export default {
  data() {
    return {
      lowLatency: false,
      rtcInstance: '',
      showLinkButton: false,
      rtcList: {},
      localStream: '',
      masterStream: '',
      isRtcState: false,
      toolkit: '',
      localStreamCam: true,
      localStreamMic: true,
      localUplink: 0,
      handUpDialog: false,
      rtcListHeight: 0,
      videoLink: true,
    };
  },
  mounted() {
    this.calcRtcListHeight();
  },

  beforeDestroy() {
    this.handUp();
    this.rtcInstance = '';
    this.showLinkButton = false;
    this.rtcList = {};
    this.localStream = '';
    this.masterStream = '';
    this.isRtcState = false;
  },

  methods: {
    toolkitHandle(type) {
      const { toolkit } = this;

      switch (type) {
        case 'applyAndStop':
          if (this.rtcInstance.rtcConnected) {
            this.handUpDialog = true;
          } else if (this.rtcInstance.applyStatus) {
            toolkit.cancel();
            this.rtcInstance.cancelJoinChannel();
          } else {
            this.rtcInstance.joinChannel();
            toolkit.apply();
          }
          break;
        case 'camera':
          this.rtcInstance.toggleDevice('video');
          break;
        case 'mic':
          this.rtcInstance.toggleDevice('audio');
          break;
        case 'sliderOn':
          toolkit.sliderOn();
          break;
        case 'sliderOff':
          toolkit.sliderOff();
          break;
        default:
          break;
      }
    },

    initRtcEvents() {
      const player = liveSdk.player;
      this.rtcInstance.on('OPEN_MICROPHONE', (evt) => {
        console.info('讲师开启连麦, 可发起申请加入连麦', evt);
        this.videoLink = evt.type === 'video';
        this.showLinkButton = true;
        if (!this.toolkit) {
          this.toolkit = Toolkit(this.toolkitHandle, (type) => {
            const lang = {
              apply: '申请连线',
              calling: '请求中...',
            };
            return lang[type];
          });
        }
        this.toolkit && this.toolkit.show();
      });

      this.rtcInstance.on('CLOSE_MICROPHONE', (evt) => {
        console.info('讲师关闭连麦，可禁止发起连麦申请', evt);
        this.showLinkButton = false;
        this.toolkit && this.toolkit.hide();
      });

      this.rtcInstance.on('ALLOW_MICROPHONE', (evt) => {
        this.lowLatency = liveSdk.player.lowLatency;
        this.isRtcState = true;
        console.info('连麦申请通过， 开始连麦', evt);
      });

      this.rtcInstance.on('INIT_LOCAL_STREAM_READY', (evt) => {
        console.info('准备开始推流，设置推流参数', evt);
        if (!player.lowLatency) {
          player.pause();
          this.$refs.cPlayer.$el.classList.add('c-hide');
        }
        this.localStream = evt;
        this.$nextTick(() => {
          evt.init({
            element: document.getElementById('plv-rtc-item__local'), // 选择需要显示本地流的节点
            control: false,
          });
        });
      });
      this.rtcInstance.on('INIT_LOCALSTREAM_SUCCESS', (evt) => {
        console.info('初始化本地流成功', evt);
      });
      this.rtcInstance.on('PUBLIC_STREAM_SUCCESS', (evt) => {
        console.info('推流成功', evt);
        this.toolkit.success('video');
      });
      this.rtcInstance.on('CLIENT_BANNED', (evt) => {
        this.isRtcState = false;
        player.play();
        this.resetRtcState();
        this.toolkit && this.toolkit.hide();
        if (this.showLinkButton) {
          this.toolkit.show();
        }
        console.info('被讲师挂断连麦', evt);
      });

      // 挂断/结束连线/被主播下麦/主播结束连麦，重置状态
      this.rtcInstance.on('LEAVE_CHANNEL_SUCCESS', (evt) => {
        player.play();
        this.resetRtcState();
        this.toolkit && this.toolkit.hide();
        if (this.showLinkButton) {
          this.toolkit.show();
        }
        this.isRtcState = false;
      });

      this.rtcInstance.on('USER_STREAM_ADDED', (evt) => {
        if (evt.teacher) {
          this.masterStream = evt.stream;
          evt.subscribe({
            element: document.getElementById('plv-rtc-item__master'),
            control: false,
            playCallBack: (err) => {
              if (err) {
                console.info('当前流播放失败');
                this.$set(this.masterStream, 'playFail', true);
              }
            }
          }, (err) => {
            console.info('订阅失败', err);
          });
        } else {
          this.$set(this.rtcList, evt.streamId, evt.stream);
          this.$nextTick(() => {
            evt.subscribe({
              element: document.getElementById(`plv-rtc-item__${evt.streamId}`),
              control: false,
              playCallBack: (err) => {
                if (err) {
                  this.$set(this.rtcList[evt.streamId], 'playFail', true);
                }
              }
            });
          });
        }
      });

      this.rtcInstance.on('USER_STREAM_SUBSCRIBED', (evt) => {
        console.info('USER_STREAM_SUBSCRIBED 订阅成功', evt);
      });
      // this.rtcInstance.on('NETWORK_QUALITY', function(evt) {
      //   console.log('上行质量为:', evt.uplinkNetworkQuality);
      //   console.log('下行质量为:', evt.downlinkNetworkQuality);
      // });
      // 处理声音对应的开闭钩子
      this.rtcInstance.on('LOCAL_MUTE_AUDIO', (evt) => {
        this.toolkit.toggleMic(true);
        this.localStreamMic = false;
      });
      this.rtcInstance.on('LOCAL_UNMUTE_AUDIO', (evt) => {
        this.toolkit.toggleMic(false);
        this.localStreamMic = true;
      });
      // 处理摄像头对应的开闭钩子
      this.rtcInstance.on('LOCAL_MUTE_VIDEO', (evt) => {
        this.toolkit.toggleCamera(true);
        this.localStreamCam = false;
      });
      this.rtcInstance.on('LOCAL_UNMUTE_VIDEO', (evt) => {
        this.toolkit.toggleCamera(false);
        this.localStreamCam = true;
      });
      this.rtcInstance.on('NETWORK_QUALITY', (net) => {
        this.localUplink = net.uplinkNetworkQuality;
      });
    },

    // 重置状态
    resetRtcState() {
      this.$refs.cPlayer.$el.classList.remove('c-hide');
      this.rtcList = {};
      this.localStream = '';
      this.localStreamCam = true;
      this.localStreamMic = true;
    },

    // 挂断
    handUp() {
      this.rtcInstance.leaveChannel(false);
      this.handUpDialog = false;
    },

    calcRtcListHeight() {
      this.rtcListHeight = Math.ceil(9 * document.body.clientWidth / 16) + 80;
    },

    resetRtcListPlayState(id) {
      this.$set(this.rtcList[id], 'playFail', false);
    },

    resetMasterPlayState() {
      this.$set(this.masterStream, 'playFail', false);
    }
  }
};
