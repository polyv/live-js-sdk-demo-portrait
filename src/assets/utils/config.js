export const config = {
  // 基础api的域名
  baseUrl: '//api.polyv.net',
  // 聊天室api的域名
  chatBaseUrl: '//apichat.polyv.net',
  appId: '',
  appSecret: '',
  verifyUrl: '',
  channelId: '',
  user: {
    userId: '',
    userName: '',
    avatar: ''
  },
  // 回放vid
  vid: '',
  // 播放回放类型
  vodType: '',
  // 默认头像
  defaultAvatar: '//livestatic.videocc.net/assets/wimages/missing_face.png'
};

export const updateConfig = (key, value) => {
  if (typeof key === 'object') {
    for (const k in key) {
      config[k] = key[k];
    }
    return;
  }
  config[key] = value;
};
