const express = require('express');
const render = require('../../services/render');
const router = express.Router();
const API_URL = process.env.API_URL;

router.get('/', async (req, res) => {
  render(req, res, {
    page: 'site/index',
    title: 'Homepage',
    uri: [{
      key: 'posts',
      url: 'https://jsonplaceholder.typicode.com/posts',
      req,
      cache: {
        enable: true,
        keyword: 'posts',
        expireTime: 3901590,
        watch: true,
        watchTime: 1000 * 60
      }
    }]
  });
});

module.exports = router;
