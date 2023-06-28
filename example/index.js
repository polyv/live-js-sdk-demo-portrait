import PolyvPortraitWatch from "../src/index.js";
import VConsole from "vconsole";

let getUrlParams = url => {
  let result = {};
  url = new URL(url || window.location.href);
  const iterableParams = url.searchParams.entries();
  for (let [key, value] of iterableParams) {
    result[key] = value;
  }
  return result;
};

let params = getUrlParams();

new PolyvPortraitWatch({
  el: document.getElementById("portrait-view"),
  appId: params.appId || "APP_ID",
  appSecret: params.appSecret || "APP_SECRET",
  channelId: params.channelId || "CHANNEL_ID",
  user: {
    userId: params.userId || "123456",
    userName: params.userName || "polyv-test"
  }
});

new VConsole();
