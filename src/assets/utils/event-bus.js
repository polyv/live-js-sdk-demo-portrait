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
// 章节弹窗显示
export const CHAPTER_VISIBLE = 'CHAPTER_VISIBLE';
// 切换只看主持人、查看全部
export const ONLY_HOST = 'ONLY_HOST';
/** 举报反馈显示 */
export const FEED_BACK_VISIBLE = 'FEED_BACK_VISIBLE';
// 切换显示隐藏动效
export const UPDATE_DONATE_ANIMATION = 'UPDATE_DONATE_ANIMATION';
export const bus = new Vue();
