# 直播JS-SDK 竖屏DEMO

## 介绍

为了帮助客户更好地通过「POLYV 直播 JavaScript SDK」实现直播带货等竖屏播放场景，本项目提供了一个 demo 以供参考。

## 竖屏 DEMO 新特性

- 更快更方便地创建竖屏观看页。
- 支持直播带货场景的观看页模板。
- 支持左右滑动的多屏切换。
- 提供以 webpack 方式接入、可根据情况修改源码来达到项目要求。

## 快速上手

### 第一步 安装

```
<!-- 引入css -->
<link rel="stylesheet" href="polyv-portrait-watch.min.css" />
<!-- 引入js -->
<script src="polyv-portrait-watch.min.js"></script>
```

### 第二步 创建观看页

```
<!-- 创建观看页元素 -->
<div id="portrait-watch"></div>

<script>
  new PolyvPortraitWatch({
    el: '#polyv-watch',
    appId: 'APP_ID',
    appSecret: 'APP_SECRET',
    channelId: 'CHANNEI_ID',
    verifyUrl: 'VERIFY_URL',
    user: {
      userId: 'USER_ID',
      userName: 'USER_NAME',
      avatar: 'AVATAR'
    }
  });
</script>
```

## 参数说明
| 参数 | 说明 | 类型 | 是否必填 |
| --- | --- | --- | --- |
| el | 页面上存在需要载入观看页的 css 选择器 | String、Element | 是 |
| appId | 保利威后台的 appId | string | 是 |
| appSecret | 保利威后台的 appSecret | String | 否 |
| verifyUrl | verifyUrl 验证接口 | String | 否 |
| channelId | 频道号 | String | 是 |
| user | 用户信息 | Object | 是 |
| user.userId | 用户id | String | 是 |
| user.userName | 用户昵称 | String | 是 |
| user.avatar | 用户头像 | String | 否 |

> 传入参数中 `appSecret` 与 `verifyUrl` 至少传入其中一个

## 传入 verifyUrl 验证接口

verifyUrl 接口 PHP 代码示例：
```PHP
<?php
$appSecretKey = 'Your appSecretKey';
$sign = $_GET['sign'];

// 获取url query并转换成数组
parse_str($_SERVER["QUERY_STRING"], $params);

// 获取除sign外的其他参数的拼接字符串
$concated = sort_param($params);

// STEP 1
// 计算接口请求是否合法
$outPutData = '';

$verifyUrlSign = strtoupper(md5("plvPortraitApp".$concated."plvPortraitApp"));
if ($sign != $verifyUrlSign) {
  $outPutData = '{"code": -1, "message" : "invalid sign", "status": "error", "data": ""}';
  echo($outPutData);
  return;
}

// STEP 2
// 输出正确sign返回给观看页
$outPutSign = strtoupper(md5($appSecretKey.$concated.$appSecretKey));
$outPutData = '{"code": 200, "message" : "", "status": "success", "data": {"sign": "'.$outPutSign.'"}}';
echo($outPutData);


/**
 * 将参数按照ASCKII升序 key + value + key + value ... +value 拼接
 * @return [type] [description]
 */
function sort_param($params){
 
  ksort($params);
 
  $sort_result = "";
 
  foreach ($params as $key => $val) {
    if(!is_null($val) && $key != 'sign'){
      $sort_result=$sort_result.$key.$val;
    }
  }
  return $sort_result;
}

?>
```

> 由于在 html 中 appSecret 是明文显示，存在反编译风险。故建议传入 verifyUrl 验证接口

## 浏览器兼容性

支持主流移动端浏览器或 WebView，包括 UC 浏览器、QQ 浏览器、微信浏览器、各厂商自带浏览器等。

## 运行 DEMO

1. 克隆项目到本地后，执行 `npm install` 安装依赖包。
2. 安装成功后，修改项目目录下的 example/index.js 中的参数。
3. 运行 `npm run dev`。

> 采用 `verifyUrl` 方式时，可以修改 build/getSign.js 中的 `appSecret` 变量，项目内部提供以 nodejs 方式的 `verifyUrl`，修改后传入 `verifyUrl: '/getSign'` 即可。

您还可以结合 POLYV 官方文档查阅 demo 源码：

- [直播 JavaScript SDK 使用文档](https://dev.polyv.net/2019/liveproduct/l-sdk/web-sdk/)
- [直播API签名规则](https://dev.polyv.net/2018/liveproduct/l-api/notice/sign/)

## 使用源码接入方式说明

将源码项目中的 src 目录复制到待接入的项目中，引入 src 下的 main.js，详细内容可参考源码。

参考实例：

```javascript
import Vue from 'vue';
import PortraitView from 'url/main.js';

Vue.use(PortraitView, {
  appId: 'APP_ID',
  appSecret: 'APP_SECRET',
  channelId: 'CHANNEI_ID',
  verifyUrl: 'VERIFY_URL',
  user: {
    userId: 'USER_ID',
    userName: 'USER_NAME',
    avatar: 'AVATAR'
  }
});
```

```vue
<template>
  <plv-portrait-view />
<template>
```

## 补充说明

### 关于三分屏频道

- 目前暂不支持三分屏频道的竖屏观看页。

### DEMO 使用到的第三方库

- 参考项目中的 package.json 的 dependencies。
