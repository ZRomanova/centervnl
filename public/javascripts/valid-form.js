$(document).ready(function (e) {
  checkForm()
  $('#form input, #form select, #form textarea').on('input', checkForm);
})

function checkForm() {

  $("#form button[type=submit], #form button.submit").prop("disabled", false);
  $('#form input, #form select, #form textarea').each(function (e) {
    // console.log($(this)[0].validity.valid)
    let isValid = $(this)[0].validity.valid
    if (!isValid) {
      $("#form button[type=submit], #form button.submit").prop("disabled", true);
    }
  })
}

function addresseeChange(ctrl) {
  if (ctrl.value == 'Entity') {
    $('#organization-block').removeClass('d-none')
    $('#organization-block').addClass('d-block')
    $("#form .org_ctrl").prop("required", true);
    $("#form .org_ctrl").prop("disabled", false);

  } else {
    $('#organization-block').removeClass('d-block')
    $('#organization-block').addClass('d-none')
    $("#form .org_ctrl").prop("required", false);
    $("#form .org_ctrl").prop("disabled", true);
  }
  checkForm()
}


function changePayMethod(select) {
  $('.text-method-3, .text-method-2').each(function () {
    $(this).removeClass('d-block')
  })
  $('.text-method-3, .text-method-2').each(function () {
    $(this).addClass('d-none')
  })

  $("#form .card__field").prop("required", false);
  $("#form .card__field").prop("disabled", true);

  if (select.value == "Банковская карта") {
    $('.text-method-2').each(function () {
      $(this).removeClass('d-none')
    })

    $('.text-method-2').each(function () {
      $(this).addClass('d-block')
    })
    $("#form .card__field").prop("required", true);
    $("#form .card__field").prop("disabled", false);

  } else if (select.value == "Банковский перевод") {
    $('.text-method-3').each(function () {
      $(this).removeClass('d-none')
    })

    $('.text-method-3').each(function () {
      $(this).addClass('d-block')
    })
  }
  checkForm()
}

function changeDeliveryType(select) {
  if (select.value == "Самовывоз") {
    $("#text-delivery-type").text("Забрать заказ можно будет по адресу ул. Ключевая, д. 22, к.2. Мы пришлём уведомление о готовности.")
    $("#delivery_address").removeClass('d-block')
    $("#delivery_address").addClass('d-none')
    $("#form .address__field").prop("required", false);
    $("#form .address__field").prop("disabled", true);
  } else {
    $("#text-delivery-type").text("Доставка оплачивается отдельно. Мы свяжемся с вами и сообщим стоимость.")
    $("#delivery_address").addClass('d-block')
    $("#delivery_address").removeClass('d-none')
    $("#form .address__field").prop("required", true);
    $("#form .address__field").prop("disabled", false);
  }
}