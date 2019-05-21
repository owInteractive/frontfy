const express = require('express');
const render = require('../../services/render');
const router = express.Router();
const mail = require('../../utils/mail/nodemailer');

router.get('/404', (req, res) => {

  render(req, res, {
    page: '404',
    title: 'Page not founded!'
  });

});

router.get('/500', (req, res) => {

  render(req, res, {
    page: '500',
    title: 'Internal error, try again later.'
  });

});

router.use(function (req, res, next) {

  res.status(404).send(
    res.redirect('/404')
  );

});

router.use(function (err, req, res, next) {

  console.log('500 error: ', err);

  if (process.env.NODE_ENV === 'production') {

    const mailParams = {
      uri: '500',
      req: req
    }

    const mailError = {
      url: 'URL not specified',
      status: 500,
      data: err.stack
    }

    mail.send(mailParams, mailError);

  }

  res.status(500).send(
    res.redirect('/500')
  );

});

module.exports = router;
