const http = require('./http');

module.exports = {

  /**
   * Request data from API and return a JSON object
   * @param {*} req // Express request
   * @param {*} res // Express response
   * @param {*} params // Request params
   */
  request: async (req, res, params) => {

    const response = await http.request(params);

    res.json(response);
    res.end();

  }

}
