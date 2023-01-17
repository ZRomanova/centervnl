

const dropdownItems = document.querySelectorAll('.dropdown-item')

if (dropdownItems) dropdownItems.forEach((dd)=>{
    dd.addEventListener('click', function (e) {
        let url = dd.getAttribute('href')
        location.href = url
    })
})




const togglePasswordA = document.querySelector("#togglePasswordA");
const passwordA = document.querySelector("#auth-password");

if (togglePasswordA && passwordA) togglePasswordA.addEventListener("click", function () {
  // toggle the type attribute
  const type = passwordA.getAttribute("type") === "password" ? "text" : "password";
  passwordA.setAttribute("type", type);
  // toggle the eye icon
  this.classList.toggle('fa-eye');
  this.classList.toggle('fa-eye-slash');
});

const togglePasswordR = document.querySelector("#togglePasswordR");
const passwordR = document.querySelector("#registr-password");

if (togglePasswordR && passwordR) togglePasswordR.addEventListener("click", function () {
  // toggle the type attribute
  const type = passwordR.getAttribute("type") === "password" ? "text" : "password";
  passwordR.setAttribute("type", type);
  // toggle the eye icon
  this.classList.toggle('fa-eye');
  this.classList.toggle('fa-eye-slash');
});

const togglePasswordE = document.querySelector("#togglePasswordE");
const passwordE = document.querySelector("#registr-emo-password");

if (togglePasswordE && passwordE) togglePasswordE.addEventListener("click", function () {
  // toggle the type attribute
  const type = passwordE.getAttribute("type") === "password" ? "text" : "password";
  passwordE.setAttribute("type", type);
  // toggle the eye icon
  this.classList.toggle('fa-eye');
  this.classList.toggle('fa-eye-slash');
});

const togglePasswordAE = document.querySelector("#togglePasswordAE");
const passwordAE = document.querySelector("#edit-password");

if (togglePasswordAE && passwordAE) togglePasswordAE.addEventListener("click", function () {
  // toggle the type attribute
  const type = passwordAE.getAttribute("type") === "password" ? "text" : "password";
  passwordAE.setAttribute("type", type);
  // toggle the eye icon
  this.classList.toggle('fa-eye');
  this.classList.toggle('fa-eye-slash');
});

$('.item-a').first().addClass('active');
$('.item-b').first().addClass('active');
$('.item-bb').first().addClass('active');

$('.item-2').each(function(index) {
  $('.item-3', this).first().addClass('active')
  $('.carousel-indicators-orange', this).first().addClass('active')
})

$('.item-1').each(function(index) {
  $('.item-3', this).first().addClass('active')
  $('.carousel-indicators-orange', this).first().addClass('active')
})

function changePaySelect() {
  const form = $('#priceList')[0]
  if (+form.elements.price.value != 0) {
    $('#pay').removeClass('d-none')
    $('#pay').addClass('d-block mb-3')
  } else {
    $('#pay').removeClass('d-block')
    $('#pay').addClass('d-none mb-3')
  }
  for(const inp of form.elements.price) {
    if (inp.checked) {form.elements.priceID.value = inp.id}
  }
}

function changeServiceForm(form) {
  let disabled = false
  if (!form.elements.date.value) disabled = true
  if (!form.elements.price.value) disabled = true
  $('#checkout')[0].disabled = disabled
}

$('input[type=radio][name=address]').on('change', function() {
  const total = +$('#total')[0].innerText
  switch ($(this).val()) {
    case '':
      $('#delivery')[0].value = total < 2000 ? 200 : 0
      $('#input-total')[0].value = total < 2000 ? total + 200 : total
      $('#total-block')[0].innerText = `Итого: ${total < 2000 ? total + 200 : total} ₽`
      
      break;
    default:
      $('#delivery')[0].value = 0
      $('#input-total')[0].value = total
      $('#total-block')[0].innerText = `Итого: ${total} ₽`
      break;
  }
});


function updateInBin(id, count) {
  $.ajax({
    type: "PATCH",
    dataType: 'json',
    url: `/api/orders/product/${id}`,
    data: count ? {count} : {},
    success: function(data) {
      $('#order-bin')[0].innerText = ' ' + data.products.length
      let binHTML = `
      <div class="col-12">
        <ul class="list-group">
          <li class="list-group-item col-12">
      `
      let total = 0
      for (let item of data.products) {
        if (total > 0) binHTML += `<hr class="m-4" >`
        total += item.price * item.count
        binHTML += (`
        <div class="row">
          <div class="col-11">
            <div class="row p-2">
              <div class="col-8">${item.name}</div>
              <div class="col-4">${item.price} ₽ x ${item.count}</div>
              <div class="col-12">${item.description}</div>
            </div>
          </div>
          <div class="col-1"> 
            <a class="col-12" onclick="updateInBin('${item._id}', 1)">
              <i class="fa-solid fa-plus"></i>
            </a>
            <a class="col-12" onclick="updateInBin('${item._id}', -1)">
              <i class="fa-solid fa-minus"></i>
            </a>
            <a class="col-12" onclick="updateInBin('${item._id}')">
              <i class="fa-solid fa-trash"></i>
            </a>
          </div>
        </div>
        `)
      }
      binHTML +=  `
          </li>
          <h3>Итого: ${total} ₽</h3>
        </ul>
      </div>
      `
      $('#order-list')[0].innerHTML = binHTML
    },
  });
}