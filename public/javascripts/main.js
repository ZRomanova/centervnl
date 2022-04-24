
const dropdowns = document.querySelectorAll('.dropdown-toggle')
if (dropdowns) dropdowns.forEach((dd)=>{
    dd.addEventListener('mouseover', function (e) {
        var el = this.nextElementSibling
        el.style.display = el.style.display==='block'?'none':'block'
    })
    dd.addEventListener('mouseout', function (e) {
        var el = this.nextElementSibling
        el.style.display = el.style.display==='block'?'block':'none'
    })
    dd.addEventListener('click', function (e) {
        let url = dd.getAttribute('href')
        location.href = url
    })
})

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


