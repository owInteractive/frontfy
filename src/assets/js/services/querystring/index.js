export const getQuery = (parameter) => {

  let local = location.search.substring(1, location.search.length);
  let value = false;
  let name;
  let params = local.split("&");

  for (let i = 0; i < params.length; i++) {

    name = params[i].substring(0, params[i].indexOf('='));

    if (name == parameter) {
      value = params[i].substring(params[i].indexOf('=') + 1)
    }

  }

  if (value) return value;

  return undefined;

}

export const updateQuery = (oldval, newval) => {

  let search = location.search;
  let regex = new RegExp("([?;&])" + oldval + "[^&;]*[;&]?");
  let query = search.replace(regex, "$1").replace(/&$/, '');

  return (query.length > 2 ? query + "&" : "?") + (newval ? oldval + "=" + newval : '');

}

export const removeQuery = (url, parameter) => {

  let urlparts = url.split('?');

  if (urlparts.length >= 2) {

    let prefix = encodeURIComponent(parameter) + '=';
    let pars = urlparts[1].split(/[&;]/g);

    for (let i = pars.length; i-- > 0;) {

      if (pars[i].lastIndexOf(prefix, 0) !== -1) {
        pars.splice(i, 1);
      }

    }

    return urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : '');

  }

  return url;

}
