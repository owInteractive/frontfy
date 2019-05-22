import toastr from "toastr";
import { removeQueryParam } from "../url";

$(document).ready(() => {

  let search = window.location.search.replace('?', '').split('&');

  for (let i = 0; i < search.length; i++) {

    let query = search[i].split('=');
    let param = query[0];
    let value = query[1];

    showAlert(param, decodeURI(value));

  }

  function showAlert(param, message) {

    switch (param) {

      case 'success':
        toastr["success"](message);
        removeQueryParam(param);
        break;

      case 'error':
        toastr["error"](message);
        removeQueryParam(param);
        break;

      case 'warning':
        toastr["warning"](message);
        removeQueryParam(param);
        break;

      case 'info':
        toastr["info"](message);
        removeQueryParam(param);
        break;

    }

  }

});
