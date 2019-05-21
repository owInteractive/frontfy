import Vue from "vue/dist/vue.js";

Vue.directive('date', {

  inserted: function (el) {

    let seconds = parseInt(el.dataset.expire, 10);

    let days = Math.floor(seconds / (3600*24));
    seconds  -= days*3600*24;
    let hrs   = Math.floor(seconds / 3600);
    seconds  -= hrs*3600;
    let mnts = Math.floor(seconds / 60);
    seconds  -= mnts*60;

    let time = [];

    if (Math.abs(days)) {
      time.push(Math.abs(days) + "d");
    }

    if (hrs) {
      time.push(hrs + "h");
    }

    if (mnts) {
      time.push(mnts + "m");
    }

    if (seconds) {
      time.push(seconds + "s");
    }

    el.innerHTML = time.join(' ');

  }

})
