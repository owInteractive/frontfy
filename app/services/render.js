const http = require('./http');

/**
 * Render page
 * @param {*} req // Express request
 * @param {*} res // Express response
 * @param {*} params // Some options to insert inside the express render function
 */
const render = async (req, res, params) => {

  let extension = ".ejs";
  let opts = {
    layout: params.layout ? params.layout : 'site/layout',
    template: params.page,
    title: params.title,
    description: params.description,
    environment: process.env.NODE_ENV,
    canonical: req.protocol + '://' + req.get('host') + req.originalUrl,
    data: params.data ? params.data : false,
    info: params.info ? params.info : false
  }

  if (!params.data && params.uri) {
    const data = await http.requestAll(params.uri);
    opts.data = JSON.stringify(data);
  }

  res.render(params.page + extension, opts);

};

module.exports = render;
