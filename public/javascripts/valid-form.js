$(document).ready(function(e) {
  checkForm()
  $('#form input, #form select, #form textarea, .text-input').on('input', checkForm);
})

function checkForm(){
  console.log(1)
  $("#form button[type=submit]").prop("disabled", false);
  $('.text-input').each(function(e) {
    let isValid = !($(this)[0].validationMessage)
    if (!isValid) {
      $("#form button[type=submit]").prop("disabled", true);
    }
  })
  
}

