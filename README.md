# 直播 JS-SDK 竖屏 DEMO


## 介绍

为了帮助客户更好地通过「POLYV 直播 JavaScript SDK」实现直播带货等竖屏播放场景，本项目提供了一个 demo 以供参考。

### 浏览器兼容性

支持主流移动端浏览器或 WebView，包括 UC 浏览器、QQ 浏览器、微信浏览器、各厂商自带浏览器等。


## 运行 demo

1. 克隆项目到本地后，在命令行界面中执行 `npm ci` 安装依赖包。
2. 修改项目目录下 example/index.js 中的 appId 和 appSecret 为您账号的对应设置。
3. 在命令行界面中执行 `npm run dev`。
4. 使用浏览器打开 `http://localhost:15018/` 即可打开 demo 页。


## 接入到您的项目

### 直接接入

如果您无需修改 demo 的样式和功能，可以直接把 demo 当做组件放置到页面上。

#### 第一步，引入相关依赖文件

``` html
<!-- 引入样式文件，位于项目的 dist 文件夹内 -->
<link rel="stylesheet" href="polyv-portrait-watch.min.css" />
<!-- 引入脚本文件，位于项目的 dist 文件夹内 -->
<script src="polyv-portrait-watch.min.js"></script>
```

#### 第二步，创建组件实例

``` html
<!-- 创建观看页元素 -->
<div id="portrait-watch"></div>

<script>
  new PolyvPortraitWatch({
    el: '#portrait-watch',
    appId: 'APP_ID',
    appSecret: 'APP_SECRET',
    channelId: 'CHANNEI_ID',
    user: {
      userId: 'USER_ID',
      userName: 'USER_NAME',
      avatar: 'AVATAR'
    }
  });
</script>
```

### 使用源码接入

将本项目的 src 目录复制到待接入项目中，引入 src 下的 main.js。

参考实例：

``` javascript
import Vue from 'vue';
import PortraitView from 'src/main.js';

Vue.use(PortraitView, {
  appId: 'APP_ID',
  appSecret: 'APP_SECRET',
  channelId: 'CHANNEI_ID',
  user: {
    userId: 'USER_ID',
    userName: 'USER_NAME',
    avatar: 'AVATAR'
  }
});
```

``` html
<template>
  <plv-portrait-view />
<template>
```

开发过程中，您可以根据自身需求适当修改 demo 源代码。

### PolyvPortraitWatch（PortraitView） 的参数说明
| 参数 | 说明 | 类型 | 是否必填 |
| --- | --- | --- | --- |
| el | 挂载组件的元素，可以为选择器或元素 | string、HTMLElement | 是 |
| appId | 保利威后台的 appId | string | 是 |
| appSecret | 保利威后台的 appSecret | string | 是 |
| channelId | 频道号 | string | 是 |
| user | 用户信息 | Object | 是 |
| user.userId | 用户id | string | 是 |
| user.userName | 用户昵称 | string | 是 |
| user.avatar | 用户头像 | string | 否 |


## 补充说明

### 已知问题
- 目前暂不支持云课堂（三分屏）频道。
- 目前暂不支持回放。

### 安全性说明（重要）
- 实际使用时，请不要将 appSecret 暴露在前端，本 demo 仅为演示。

## 其他文档
您还可以结合 POLYV 官方文档查阅 demo 源码：
- [直播 JavaScript SDK 使用文档](https://dev.polyv.net/2019/liveproduct/l-sdk/web-sdk/)
- [直播API签名规则](https://dev.polyv.net/2018/liveproduct/l-api/notice/sign/)

### DEMO 使用到的第三方库
- 参考项目中的 package.json 的 dependencies。
