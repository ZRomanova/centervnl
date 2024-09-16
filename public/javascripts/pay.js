


$('.submit').click(function (e) {

  var formData = new FormData(form);
  if (formData.get("payment[method]") == "Банковская карта") payByCard(formData)

  else noPayOrder(formData)
})

function payByCard(formData) {
  const checkout = new cp.Checkout({
    publicId: 'pk_af1616eb150356d4911c1f2a80aaa',
    container: document.getElementById("#form")
  });

  checkout.createPaymentCryptogram()
    .then((cryptogram) => {

      let data = {
        "Order": {
          addressee_type: formData.get('addressee_type'),
          name: formData.get('name'),
          surname: formData.get('surname'),
          patronymic: formData.get('patronymic'),
          email: formData.get('email'),
          tel: formData.get('tel'),
          org_name: formData.get('org_name'),
          org_actual_address: formData.get('org_actual_address'), //фактический адрес
          org_legal_address: formData.get('org_legal_address'), //Юридический адрес
          org_activity: formData.get('org_activity'),
          org_email: formData.get('org_email'),
          org_tel: formData.get('org_tel'),
          delivery_type: formData.get('delivery_type'),
          delivery_address: formData.get('delivery_address'),
        },
        "Currency": "RUB",
        "IpAddress": formData.get('ip'),
        "Description": "Оплата в магазине АНО РЦ Вера. Надежда. Любовь",
        "AccountId": formData.get('email'),
        "Email": formData.get('email'),
        // "Name":"CARDHOLDER NAME", 
        "CardCryptogramPacket": cryptogram,
        "Payer": {
          "FirstName": formData.get('name'),
          "LastName": formData.get('surname'),
          "MiddleName": formData.get('patronymic'),
          "Phone": formData.get('tel')
        }
      }
      $.ajax({
        type: "POST",
        dataType: 'json',
        url: '/api/orders/pay',
        data,
        success: function (data) {
          if (data.next == "3D") {
            const form = `
          <form name="downloadForm" action="${data["AcsUrl"]}" method="POST">
            <input hidden name="PaReq" value="${data["PaReq"]}">
            <input hidden name="MD" value="${data["MD"]}">
            <input hidden name="TermUrl" value="https://centervnl.ru/api/orders/pay/finish"> 
          </form>
          `
            $(document.body).append($(form));
            document.forms['downloadForm'].submit()

          } else if (data.next == "finish") {
            location.href = "/shop/order/finish/"
          } else {
            $('#error-text')[0].innerText = data["message"]
          }
        }
      })

    }).catch((errors) => {
      console.log(errors)
    });
}



function noPayOrder(formData) {

  let data = {
    "payment.method": formData.get("payment[method]"),
    addressee_type: formData.get('addressee_type'),
    name: formData.get('name'),
    surname: formData.get('surname'),
    patronymic: formData.get('patronymic'),
    email: formData.get('email'),
    tel: formData.get('tel'),
    org_name: formData.get('org_name'),
    org_actual_address: formData.get('org_actual_address'), //фактический адрес
    org_legal_address: formData.get('org_legal_address'), //Юридический адрес
    org_activity: formData.get('org_activity'),
    org_email: formData.get('org_email'),
    org_tel: formData.get('org_tel'),
    delivery_type: formData.get('delivery_type'),
    delivery_address: formData.get('delivery_address'),
  }

  $.ajax({
    type: "POST",
    dataType: 'json',
    url: '/api/orders/nopay',
    data,
    success: function (data) {
      if (data.next == "finish") {
        location.href = "/shop/order/finish/"
      } else {
        $('#error-text')[0].innerText = data["message"]
      }
    }
  })
}