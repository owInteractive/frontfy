const docx = require('docx');
const fs = require('fs');
const chalk = require('chalk');
const logSymbols = require('log-symbols');
const cache = require('../../db/redis/cache');

module.exports = {

  /**
   * Generate error log
   */
  generate: async () => {

    return new Promise(async (resolve, reject) => {

      cache
        .getAllErrors()
        .then(errors => {

          let packer = new docx.Packer();
          let logsPath = './dist/logs';

          if (!fs.existsSync(logsPath)) fs.mkdirSync(logsPath);

          const doc = module.exports.getDocStyles();
          const dateNow = new Date().toLocaleString().split(' ');
          const date = dateNow[0].split('-').reverse().join('-');
          const time = dateNow[1].replace(/\:/g, '-');
          const dateTime = date + ' às ' + time;
          const title = new docx.Paragraph('Relatório de erros gerado em ' + dateTime).heading1().addRun(new docx.TextRun().break());

          doc.addParagraph(title);

          errors.forEach(function (key, index) {

            const keys = JSON.parse(key.value);
            const content = new docx.Paragraph();

            if (index === 0) {
              content.addRun(
                new docx.TextRun('__________________________________________________________________________________________')
              )
            }

            content.addRun(
              new docx.TextRun()
              .break()
              .break()
            )

            content.addRun(
              new docx.TextRun('Keyword (ID): ')
              .font("Arial")
              .size(24)
              .bold()
              .break()
            );

            content.addRun(
              new docx.TextRun(key.key)
              .font("Arial")
              .size(24)
            );

            content.addRun(
              new docx.TextRun('URL: ')
              .font("Arial")
              .size(24)
              .bold()
              .break()
            );

            content.addRun(
              new docx.TextRun(keys.url)
              .font("Arial")
              .size(24)
            );

            content.addRun(
              new docx.TextRun('Date: ')
              .font("Arial")
              .size(24)
              .bold()
              .break()
            );

            content.addRun(
              new docx.TextRun(keys.date + ' as ' + keys.time)
              .font("Arial")
              .size(24)
            );

            content.addRun(
              new docx.TextRun('Status: ')
              .font("Arial")
              .size(24)
              .bold()
              .break()
            );

            content.addRun(
              new docx.TextRun(keys.status)
              .font("Arial")
              .size(24)
            );

            content.addRun(
              new docx.TextRun('Message: ')
              .font("Arial")
              .size(24)
              .bold()
              .break()
            )

            content.addRun(
              new docx.TextRun(JSON.stringify(keys.data))
              .font("Arial")
              .size(24)
            );

            content.addRun(
              new docx.TextRun('Timestamp: ')
              .font("Arial")
              .size(24)
              .bold()
              .break()
            )

            content.addRun(
              new docx.TextRun(Date.now())
              .font("Arial")
              .size(24)
            );

            content.addRun(
              new docx.TextRun()
              .break()
            )

            content.addRun(
              new docx.TextRun('__________________________________________________________________________________________')
            )

            doc.addParagraph(content);

          });

          packer
            .toBuffer(doc)
            .then(buffer => {

              const fileName = `log-error-${date + '-' + time}.docx`;

              fs.writeFileSync(`${logsPath}/${fileName}`, buffer);

              resolve({
                status: 200,
                file: {
                  buffer: buffer,
                  name: fileName
                },
                message: 'Report generated with success!'
              });

            }).catch(err => {

              throw new Error(err);

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

  },

  /**
   * Get the docx styles
   */
  getDocStyles: () => {

    const doc = new docx.Document();

    doc.Styles.createParagraphStyle("Heading1", "Heading 1")
      .basedOn("Normal")
      .next("Normal")
      .quickFormat()
      .font("Arial")
      .size(28)
      .bold()
      .color("000000")
      .spacing({
        line: 340
      })

    return doc;

  }

}
