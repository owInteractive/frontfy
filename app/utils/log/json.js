const fs = require('fs');
const chalk = require('chalk');
const logSymbols = require('log-symbols');
const cache = require('../../db/redis/cache');

module.exports = {

  generate: () => {

    return new Promise(async (resolve, reject) => {

      const dateNow = new Date().toLocaleString().split(' ');
      const date = dateNow[0].split('-').reverse().join('-');
      const time = dateNow[1].replace(/\:/g, '-');
      const logsPath = './dist/logs';
      const fileName = `log-error-${date + '-' + time}.json`;

      if (!fs.existsSync(logsPath)) fs.mkdirSync(logsPath);

      cache
        .getAllErrors()
        .then(errors => {

          const jsonContent = JSON.stringify(errors, null, 4);

          fs.writeFileSync(`${logsPath}/${fileName}`, jsonContent);

          resolve({
            status: 200,
            message: 'Report generated with success!'
          });

        })
        .catch(err => {

          console.log(logSymbols.error, chalk.red('Occurred an error on generate the report: ' + err));

          return reject({
            status: 500,
            data: err,
            message: 'Occurred an error on generate the report'
          });

        });

    });

  }

}
