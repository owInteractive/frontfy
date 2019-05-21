import Vue from "vue/dist/vue.js";
import axios from "axios";

export default () => {

  if ($('#home').length > 0) {

    return new Vue({

      el: '#home',

      data: {
        message: 'Welcome to Frontfy!'
      },

      mounted() {

        axios
          .get('/panel/logs/json')
          .then(response => {

            console.log(response);

          })
          .catch(error => {

            console.log('Ocorreu um erro ao gerar o documento: ', error);

          });

      }

    });

  }

}
