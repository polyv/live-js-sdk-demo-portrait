<template>
  <div
    data-not-live
    class="c-player__wrap">
    <div class="c-player__wrap__content">
      <div
        class="c-player__wrap__content__section">
        <div class="c-not-live__img"></div>
        <span>暂无直播</span>
      </div>
    </div>
  </div>
</template>

<style>
.c-not-live__img {
  width: 154px;
  height: 120px;
  margin-bottom: 12px;
  background-image: url(./imgs/end-placeholder.png);
  background-size: 100% 100%;
}
</style>
