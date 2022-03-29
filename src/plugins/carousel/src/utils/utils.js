export const setAnimationClocker = window.requestAnimationFrame ||
                                   window.mozRequestAnimationFrame ||
                                   window.webkitRequestAnimationFrame ||
                                   window.msRequestAnimationFrame ||
                                   function(fn) { return setTimeout(fn, 1000 / 60); };

export const removeAnimationClocker = window.cancelAnimationFrame ||
                                      window.mozCancelAnimationFrame ||
                                      clearTimeout;
