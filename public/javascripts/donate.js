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
      $.ajax({
        type: "POST",
        dataType: 'json',
        url: '/help/donate/',
        data,
        success: function(data) {
          if (data.next == "3D") {
            const form = `
            <form name="downloadForm" action="${data["AcsUrl"]}" method="POST">
              <input hidden name="PaReq" value="${data["PaReq"]}">
              <input hidden name="MD" value="${data["MD"]}">
              <input hidden name="TermUrl" value="http://centervnl.ru/help/donate/finish/"> 
            </form>
            `
            $(document.body).append($(form));
            document.forms['downloadForm'].submit()
          } else if (data.next == "finish") {
            location.href = "/help/donate/finish/"
          } else {
            $('#error-text')[0].innerText = data["message"]
          }
        }
      })

    }).catch((errors) => {
        console.log(errors)
    });
})

