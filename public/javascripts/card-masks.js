'use strict';

(function() {
    var numCard = document.getElementById('numCard');
    var nameOwner = document.getElementById('nameOwner');
    var dateCard = document.getElementById('dateCard');
    // var monthCard = document.getElementById('monthCard');
    // var yearCard = document.getElementById('yearCard');
    var cvvCard = document.getElementById('cvvCard');

    var optionNum = {
        mask: '0000 0000 0000 0000 000'
    }
    var cardMask = new IMask(numCard, optionNum);

    var optionName = {
        mask: 'string*string2',
        definitions: {
            '*': /\s/
        },
        blocks: {
            string: {
                mask: /^[A-Za-z]+$/
            },
            string2: {
                mask: /^[A-Za-z]+$/
            }
        }
    }
    var nameMask = new IMask(nameOwner, optionName);

    var optionCvv = {
      mask: '000'
    }
    var cvvMask = new IMask(cvvCard, optionCvv);



    var optionDate = {
        mask: '00 / 00'
      }
    var monthMask = new IMask(dateCard, optionDate);


    // window.numCard = numCard;
})();



  