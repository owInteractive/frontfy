const client = require('./connection').connection();
const {
  parse,
  stringify
} = require('flatted/cjs');

module.exports = {

  /**
   * Get cache keyword
   * @param {*} keyword // Redis keyword identifier
   * @param {*} request // Request information from client
   */
  get: async (keyword, request) => {

    return await client
      .getAsync(keyword)
      .then(async (response) => {

        if (request) module.exports.update(keyword, request);
        if (response) return JSON.parse(response);

        return false;

      })
      .catch((err) => err);

  },

  /**
   * Get all errors from Redis
   */
  getAllErrors: () => {

    return new Promise((resolve, reject) => {

      let errors = [];

      client.keys('*', (err, keys) => {

        if (err) {
          return reject({
            status: 500,
            data: err,
            message: 'Occurred an error'
          });
        }

        if (keys) {

          keys.forEach((keyword, i) => {

            client.ttl(keyword, (err, expireTime) => {

              client
                .getAsync(keyword)
                .then(response => {

                  if (keyword.match(/request:error:/)) {
                    errors.push({
                      'key': keyword,
                      'value': response,
                      'expire': expireTime
                    });
                  }

                  resolve(errors);

                }).catch((err) => {

                  return reject({
                    status: 500,
                    data: err,
                    message: 'Occurred an error'
                  });

                });

            });

          });

        } else {

          resolve(errors);

        }

      });

    });

  },

  /**
   * Set cache keyword
   * @param {*} keyword // Redis keyword identifier
   * @param {*} data // Redis data
   * @param {number} [expireTime=3600] // Keyword expire time in seconds, defaults to 3600 (~1hr)
   */
  set: (keyword, data, expireTime = 3600) => {

    client.set(keyword, JSON.stringify(data));
    client.expire(keyword, expireTime);

    return true;

  },

  /**
   * Update cache keyword
   * @param {*} keyword // Redis keyword identifier
   * @param {*} request // Request information from client
   */
  update: async (keyword, request) => {

    setTimeout(async () => {

      let intervalObject = {};

      const http = require('./../../services/http');
      const params = {
        ...request
      }

      params.cache.enable = false;

      if (request.cache.watch) {

        const watchTime = request.cache.watchTime || 3600;

        client
          .getAsync('cache:watch')
          .then(async (response) => {

            let routes = response ? parse(response) : [];
            let founded = false;

            for (let i = 0; i < routes.length; i++) {

              const route = routes[i];

              if (route.cache) {

                if (route.cache.keyword == keyword || route.uri == keyword) {

                  founded = true;
                  break;

                }

              }

            }

            if (!founded) {

              routes.push(request);
              client.set('cache:watch', stringify(routes));

              intervalObject[keyword] = setInterval(async () => {

                const data = await http.request(params);

                if (data && data.error) {

                  clearInterval(intervalObject[keyword]);
                  delete intervalObject[keyword];

                  module.exports.delete(keyword);

                }

              }, watchTime);

            }

          });

      } else {

        const data = await http.request(params);

        if (data && data.error) {

          module.exports.delete(keyword);

        }

      }

    }, 5000 + Math.floor(Math.random() * 1000));

  },

  /**
   * Delete cache keyword
   * @param {*} keyword // Redis keyword identifier
   */
  delete: (keyword) => {

    return client.del(keyword, (err, response) => {
      return response == 1 ? true : false;
    });

  },

  /**
   * Redis information
   */
  info: () => client.server_info

}
