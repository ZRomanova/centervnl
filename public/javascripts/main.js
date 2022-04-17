
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
const passwordAE = document.querySelector("#emo-password");

if (togglePasswordAE && passwordAE) togglePasswordE.addEventListener("click", function () {
  // toggle the type attribute
  const type = passwordE.getAttribute("type") === "password" ? "text" : "password";
  passwordE.setAttribute("type", type);
  // toggle the eye icon
  this.classList.toggle('fa-eye');
  this.classList.toggle('fa-eye-slash');
});

$('.item-a').first().addClass('active');

$('.item-2').each(function(index) {
  $('.item-3', this).first().addClass('active')
  $('.carousel-indicators-orange', this).first().addClass('active')
})

$('.item-1').each(function(index) {
  $('.item-3', this).first().addClass('active')
  $('.carousel-indicators-orange', this).first().addClass('active')
})



