$(document).ready(function(e) {
  checkForm()
  $('#form input, #form select, #form textarea').on('input', checkForm);
})

function checkForm(){

  $("#form button[type=submit]").prop("disabled", false);
  $('#form input, #form select, #form textarea').each(function(e) {
    console.log($(this)[0].validity.valid)
    let isValid = $(this)[0].validity.valid
    if (!isValid) {
      $("#form button[type=submit]").prop("disabled", true);
    }
  })
  
}

