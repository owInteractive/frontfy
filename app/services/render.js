const http = require('./http');

const render = async (req, res, params) => {

  let extension = ".ejs";
  let opts = {
    layout: params.layout ? params.layout : 'site/layout', // Layout
    template: params.page, // Page template
    title: params.title, // Page title
    description: params.description, // Page description
    environment: process.env.NODE_ENV, // Application environment
    canonical: req.protocol + '://' + req.get('host') + req.originalUrl, // Canonical link
    data: params.data ? params.data : false, // API data
    info: params.info ? params.info : false // Extra information
  }

  if (!params.data && params.uri) {
    const data = await http.requestAll(params.uri);
    opts.data = JSON.stringify(data);
  }

  res.render(params.page + extension, opts);

};

module.exports = render;
