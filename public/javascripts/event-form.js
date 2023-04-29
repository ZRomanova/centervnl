$('#other-role').on("input", function(e) {
  if (this.value.length) {
    $('.role-input').prop('checked', false);
  }
})

$('.role-input').click(function(e) {
  $('#other-role').prop('value', "");
})

$('.check-tel').on("input", function(e) {
  if (this.value.length) {
    $('.no-tel').prop('checked', false);
    $('.no-tel').prop('disabled', true);
  } else {
    $('.no-tel').prop('disabled', false);
  }
})

$('.check-email').on("input", function(e) {
  if (this.value.length) {
    $('.no-email').prop('checked', false);
    $('.no-email').prop('disabled', true);
  } else {
    $('.no-email').prop('disabled', false);
  }
})


$('.no-tel').on("change", function(e) {

  if (this.checked) {
    $('.check-tel').prop('value', "");
    $('.check-tel').prop('disabled', true);
  } else {
    $('.check-tel').prop('disabled', false);
  }
})

$('.no-email').on("change", function(e) {
  if (this.checked) {
    $('.check-email').prop('value', "");
    $('.check-email').prop('disabled', true);
  } else {
    $('.check-email').prop('disabled', false);
  }
})