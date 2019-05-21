const express = require('express');
const sender = require('../../services/sender');
const authService = require('../../services/auth');
const router = express.Router();
const API_URL = process.env.API_URL;

router.get('/users', async (req, res) => {

  const auth = await authService.authorizationToken(req, res);

  if (!auth) return res.redirect('/login');

  sender.request(req, res, {
    method: 'GET', // REST Method (required)
    uri: 'https://jsonplaceholder.typicode.com/users', // API URL (required)
    auth, // Endpoint has authentication (optional)
    cache: { // Cache information (optional)
      enable: true, // Enable cache (required)
      keyword: 'analytics', // Cache keyword identifier on Redis (required)
      expireTime: 3600, // Cache expire time (optional)
      watch: true, // Watch the API change (optional)
      watchTime: 3600 // Watch verification time (optional)
    }
  });

});

module.exports = router;
