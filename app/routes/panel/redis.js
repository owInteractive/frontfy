const express = require('express');
const render = require('../../services/render');
const router = express.Router();
const client = require('../../db/redis/connection').connection();
const cache = require('../../db/redis/cache');
const docx = require('../../utils/log/docx');
const json = require('../../utils/log/json');
const fs = require('fs-extra');

/**
 * Panel pages
 */
router.get('/auth', async (req, res) => {

  render(req, res, {
    page: 'panel/redis-auth',
    layout: 'panel/layout',
    title: 'Redis Panel Control - Login'
  });

});

router.get('/', async (req, res) => {

  var return_dataset = [];

  client.keys('*', async (err, keys) => {

    if (err) return console.log(err);

    if (keys) {

      var i = 0;

      if (!keys.length) {

        return render(req, res, {

          title: 'Redis Panel Control - Dashboard',
          page: 'panel/redis-control',
          layout: 'panel/layout',
          data: JSON.stringify(return_dataset),
          info: cache.info()

        });

      };

      keys.forEach(function (l) {

        client.ttl(l, function (err, out) {

          client.get(l, function (e, o) {

            i++;

            if (e) {
              console.log(e)
            } else {

              temp_data = {
                'key': l,
                'value': o,
                'expire': out
              };

              return_dataset.push(temp_data);

            };

            if (i == keys.length) {
              render(req, res, {

                title: 'Redis Panel Control - Dashboard',
                page: 'panel/redis-control',
                layout: 'panel/layout',
                info: cache.info(),
                data: JSON.stringify(return_dataset)

              });
            }
          });
        });
      });
    };
  });

});

router.get('/logs', (req, res) => {

  const logFolder = 'dist/logs';
  const files = fs.readdirSync(logFolder);

  let arr = [];

  if (files.length > 0) {

    for (const file of files) {

      let stats = fs.statSync(logFolder + '/' + file);

      arr.push({
        created_at: stats.birthtime,
        file: file
      });

    }

  }

  return render(req, res, {
    title: 'Redis Panel Control - Logs',
    page: 'panel/redis-log',
    layout: 'panel/layout',
    data: JSON.stringify(arr)
  });

});

/**
 * Panel methods
 */
router.post('/keys/flush/:key', async (req, res) => {
  const key = req.params.key.replace(/__/g, '/');
  cache.delete(key);
  res.redirect('/panel?success=Key removed from Redis!');
});

router.post('/keys/flushall', async (req, res) => {
  client.keys('*', function (err, keys) {
    if (keys.length) {
      keys.forEach(function (key) {
        cache.delete(key);
      })
    }
  });

  res.redirect('/panel?success=All keys have been removed!');

});

router.get('/keys/values/:key', async (req, res) => {

  client.ttl(req.params.key, function (err, out) {
    res.json(out)
  });

});

router.get('/logs/docx', async (req, res) => {

  const response = await docx.generate();

  res.send(response);

});

router.get('/logs/json', async (req, res) => {

  const response = await json.generate();

  res.send(response);

});

router.post('/logs/delete', (req, res) => {
  fs.unlink('dist/logs/' + req.body.name, (err) => {
    if (err) throw err;
    res.redirect('/panel/logs?success=Log removed with success!');
  });
});

module.exports = router;
