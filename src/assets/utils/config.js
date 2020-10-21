export const config = {
  baseUrl: '//api.polyv.net',
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
