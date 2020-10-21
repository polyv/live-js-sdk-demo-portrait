import Vue from 'vue';

// 窗口尺寸改变
export const WINDOW_RESIZE = 'WINDOW_RESIZE';
// 打开软键盘
export const KEYBOARD_SHOW = 'KEYBOARD_SHOW';
// 关闭软键盘
export const KEYBOARD_HIDE = 'KEYBOARD_HIDE';
// Swiper屏空白地方点击派发到播放器点击事件
export const PLAYER_CLICK = 'PLAYER_CLICK';
// 轮播屏切换结束
export const SWIPER_CHANGE = 'SWIPER_CHANGE';
// 打赏弹窗显示
export const DONATE_VISIABLE = 'DONATE_VISIABLE';
// 商品列表弹窗显示
export const SHOPPING_VISIBLE = 'SHOPPING_VISIBLE';
// 自己发言的消息派发到ChatList组件处理
export const SELF_SPEAK = 'SELF_SPEAK';
// 显示输入框
export const CHAT_INPUT_VISIBLE = 'CHAT_INPUT_VISIBLE';
// 播放器数据修改
export const UPDATE_PLAYER_STATE = 'UPDATE_PLAYER_STATE';
// 播放器控制器弹窗显示
export const PLAYER_SETTING_VISIBLE = 'PLAYER_SETTING_VISIBLE';

export const bus = new Vue();
