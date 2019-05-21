module.exports = {

  /**
   * Returns the authorization token
   * @param {*} req // Express request
   * @param {*} res // Express response
   */
  authorizationToken: (req, res) => {

    return new Promise((resolve, reject) => {

      resolve('YOUR AUTHORIZATION TOKEN HERE');

    });

  }

}
