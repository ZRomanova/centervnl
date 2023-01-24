$('.donate-circle').click(function() {
  clickDonate(this)
})

$('.donate-text').click(function() {
  clickDonate(this)
})

const clickDonate = function(element) {
  $('.donate-box').removeClass('active')
  var elParent = $(element).parent().addClass('active')
  var index = elParent.index()
  $('.donate-content').removeClass('d-block')
  $('.donate-content').addClass('d-none')
  $($('.donate-content')[index]).addClass('d-block')
  $($('.donate-content')[index]).removeClass('d-none')
}

$('#sumText').on("input", function(e) {
  if (this.value > 0) {
    $('.sumCheckButton').prop('checked', false);
  }
  if (this.value == 0) {
    $($('.sumCheckButton')[0]).prop('checked', true);
  }
})

$('.sumCheckButton').click(function(e) {
  $('#sumText').prop('value', "");
})




$('.submit').click(function(e) {

  const formData = new FormData(form);
  const checkout = new cp.Checkout({
    publicId: 'pk_af1616eb150356d4911c1f2a80aaa',
    container: document.getElementById("#form")
  });

  
  
  checkout.createPaymentCryptogram()
    .then((cryptogram) => {
      
      let data = {
        "Amount": Number(formData.get('sum')),
        "Currency":"RUB",
        "IpAddress": formData.get('ip'),
        "Description":"Благотворительное пожертвование в АНО РЦ Вера. Надежда. Любовь",
        "AccountId":formData.get('email'),
        "Email": formData.get('email'),
        // "Name":"CARDHOLDER NAME", 
        "CardCryptogramPacket":cryptogram,
        "Payer": { 
          "FirstName":formData.get('name'),
          "LastName":formData.get('lastname'),
          // "MiddleName":formData.get('email'),
          "Phone":formData.get('tel')
        }
      }
      // console.log(data)
      $.ajax({
        type: "POST",
        dataType: 'json',
        headers: {
          "Authorization": "Basic " + btoa("pk_af1616eb150356d4911c1f2a80aaa:23151917b5eaf785f055bcc8eb4ac3ba")
        },
        url: 'https://api.cloudpayments.ru/payments/cards/charge',
        data,
        success: function(data) {
          console.log(data)
          if (!data["Success"] && data["Model"] && data["Model"]["AcsUrl"]) {
            let model = data["Model"]
            Secure3D({
              "TerminalUrl": 'https://centervnl.ru/help/donate/',
              "MD": model["TransactionId"],
              "PaReq": model["PaReq"]
            }, model["AcsUrl"])
           
          }
        
        }
      })
      
    }).catch((errors) => {
        console.log(errors)
    });
})


function Secure3D(data, url) {
  $.ajax({
    type: "POST",
    dataType: 'json',
    // headers: {
    //   "Authorization": "Basic " + btoa("pk_af1616eb150356d4911c1f2a80aaa:23151917b5eaf785f055bcc8eb4ac3ba")
    // },
    url,
    data,
    success: function(data) {
      console.log(data)
    
    }
  })
}