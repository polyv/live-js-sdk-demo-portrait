import Vue from 'vue';
import portrait from './main';
import PortraitViewComp from './portrait-view/portrait-view';

export class PolyvPortraitWatch {
  constructor(config) {
    Vue.use(portrait, config);
    const el = config.el;
    let wrapEl;
    if (el instanceof HTMLElement) {
      wrapEl = el;
    } else {
      wrapEl = document.querySelector(el);
    }
    if (!wrapEl) return;
    const PortraitViewConstructor = Vue.extend(PortraitViewComp);
    const instance = new PortraitViewConstructor();
    instance.$mount();
    wrapEl.appendChild(instance.$el);
  }
}

export default PolyvPortraitWatch;
