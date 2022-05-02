function changeOptionSelect() {
  var price = +$('#price')[0].innerText
  $('#priceSelects select').each(function(index){
    price *= this.value
  })
  var result = Math.ceil(price) + ' ₽'
  $('#priceBox')[0].innerText = result
}

function addToBin() {
  const body = {description: ''}
  $('#priceSelects select').each(function(i){
    $('.price-option', this).each(function(index) {
      if (this.selected) {
        body.description += this.innerText + '; '
      }
    })
  })
  body.name = $('#product-name')[0].innerText
  body.count = +$('#count-control')[0].value
  body.price = +$('#priceBox')[0].innerText.split(' ')[0]

  $.ajax({
    type: "POST",
    dataType: 'json',
    url: '/api/orders',
    data: body,
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
      $('#add-to-bin')[0].click()
    },
  });
}

