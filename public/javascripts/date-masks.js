'use strict';

(function() {
    var dateInput = document.getElementById('dateInput');

    var optionDate = {
      mask: '00.00.0000',
      // definitions: {
      //   '*': /\./
      // },
      // blocks: {
      //   date: {
      //     mask: /^(0[1-9]|[12][0-9]|3[01])$/
      //   },
      //   month: {
      //     mask: /^(0[1-9]|1[1,2])$/
      //   },
      //   year: {
      //     mask: /^(19|20)\d{2}$/
      //   }
      // }
    }
    new IMask(dateInput, optionDate);
})();