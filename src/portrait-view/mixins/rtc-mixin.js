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
      isRtcState: false,
      toolkit: '',
    };
  },

  methods: {
    toolkitHandle(type) {
      const { toolkit } = this;

      switch (type) {
        case 'applyAndStop':
          if (this.rtcInstance.rtcConnected) {
            this.rtcInstance.leaveChannel(false);
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
      console.log('-> initRtcEvents');
      this.rtcInstance.on('OPEN_MICROPHONE', (evt) => {
        console.log('讲师开启连麦, 可发起申请加入连麦', evt);
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
        this.toolkit.show();
      });

      this.rtcInstance.on('CLOSE_MICROPHONE', (evt) => {
        console.log('讲师关闭连麦，可禁止发起连麦申请', evt);
        this.showLinkButton = false;
        this.toolkit.hide();
      });

      this.rtcInstance.on('ALLOW_MICROPHONE', (evt) => {
        this.lowLatency = liveSdk.player.lowLatency;
        this.isRtcState = true;
        console.log('连麦申请通过， 开始连麦', evt);
      });

      this.rtcInstance.on('INIT_LOCAL_STREAM_READY', (evt) => {
        console.log('准备开始推流，设置推流参数', evt);
        this.localStream = evt;
        this.$nextTick(() => {
          evt.init({
            element: document.getElementById('plv-rtc-item__local') // 选择需要显示本地流的节点
          });
        });
      });
      this.rtcInstance.on('INIT_LOCALSTREAM_SUCCESS', (evt) => {
        console.log('初始化本地流成功', evt);
      });
      this.rtcInstance.on('INIT_LOCALSTREAM_ERROR', (evt, error) => {
        console.log(evt.message);
        console.log(error);
      });
      this.rtcInstance.on('PUBLIC_STREAM_SUCCESS', (evt) => {
        console.log('推流成功', evt);
        this.toolkit.success('video');
      });
      this.rtcInstance.on('PUBLIC_STREAM_ERROR', (evt, error) => {
        console.log(evt, error);
      });
      this.rtcInstance.on('CLIENT_BANNED', (evt) => {
        this.isRtcState = false;
        console.log('被讲师挂断连麦', evt);
      });
      this.rtcInstance.on('USER_STREAM_ADDED', (evt) => {
        console.log('USER_STREAM_ADDED', evt);
        this.$set(this.rtcList, evt.streamId, evt);
        this.$nextTick(() => {
          if (evt.teacher) {
            evt.subscribe({
              element: document.getElementById('plv-master-item')
            }, (err) => {
              console.log('订阅失败', err);
            });
          } else {
            evt.subscribe({
              element: document.getElementById(`plv-rtc-item__${evt.streamId}`),
              control: true
            });
          }
        });
      });

      this.rtcInstance.on('USER_STREAM_SUBSCRIBED', (evt) => {
        console.log('USER_STREAM_SUBSCRIBED 订阅成功', evt);
      });
      // this.rtcInstance.on('NETWORK_QUALITY', function(evt) {
      //   console.log('上行质量为:', evt.uplinkNetworkQuality);
      //   console.log('下行质量为:', evt.downlinkNetworkQuality);
      // });
      // 处理声音对应的开闭钩子
      this.rtcInstance.on('LOCAL_MUTE_AUDIO', (evt) => {
        this.toolkit.toggleMic(true);
      });
      this.rtcInstance.on('LOCAL_UNMUTE_AUDIO', (evt) => {
        this.toolkit.toggleMic(false);
      });
      // 处理摄像头对应的开闭钩子
      this.rtcInstance.on('LOCAL_MUTE_VIDEO', (evt) => {
        this.toolkit.toggleCamera(true);
      });
      this.rtcInstance.on('LOCAL_UNMUTE_VIDEO', (evt) => {
        this.toolkit.toggleCamera(false);
      });
    }
  }
};
