// 封装的播放相关事件

export default {
  PLAYER_INITED: 'playerInited', // 播放器初始化完成
  PLAYING: 'playing', // 播放
  PAUSE: 'pause', // 暂停
  MODE_CHANGE: 'modechange', // 音视频模式切换
  CHANNEL_JSON_DATA: 'channelJsonData', // 播放器json信息获取
  STATUS_CHANGE: 'statusChange', // 流状态改变
  LINE_CHANGE: 'lineChange', // 线路变化
  PLAY_FAILE: 'play_faile', // 播放失败
  LEVEL_CHANGE: 'levelChange', // 清晰度变化
  RATE_CHANGE: 'rateChange', // 倍速变化
};
