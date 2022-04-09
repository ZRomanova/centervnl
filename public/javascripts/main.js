let dropdowns = document.querySelectorAll('.dropdown-toggle')
dropdowns.forEach((dd)=>{
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

let dropdownItems = document.querySelectorAll('.dropdown-item')

dropdownItems.forEach((dd)=>{
    dd.addEventListener('click', function (e) {
        let url = dd.getAttribute('href')
        location.href = url
    })
})