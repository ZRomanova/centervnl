function incrementItem(item, inc) {
  const data = $($(item).parent()[0]).data()
  // console.log(data.options)
  data.options = (data.options && data.options != "null") ? data.options.split(',') : []
  data.count = inc
  // console.log(data)
  $.ajax({
    type: "POST",
    dataType: 'json',
    url: '/api/orders',
    data,
    success: function (data) {
      let html = ''

      data.products.forEach(item => {
        html += '<div class="row mt-4 mb-4"> <div class="col-12 col-lg-6"><div class="d-flex flex-row">'
        if (item.image) {
          html += `<img src="${item.image}" class="basket-product-image me-4">`
        }
        html += `
        <div class="d-flex flex-column justify-content-center align-items-start">
          <div class="text-500-16">${item.name}</div>
          <div class="text-500-16 mt-2">${item.description}</div>
        </div></div></div>

        <div class="col-2 d-flex flex-column justify-content-center">
          <div class="d-none d-lg-block title-700-20">${item.price} руб</div>
        </div>

        <div class="col-lg-4 mt-2 mt-lg-0 d-flex flex-row flex-lg-column justify-content-center">
          <div class="row">
            <div class="col d-flex flex-row align-items-center" data-product="${item.id}" data-options="${item.options}" >
              <div onclick="incrementItem(this, -1)" class="basket-counter me-3">−</div>
              <div class="text-500-16 me-3">${item.count}</div>
              <div onclick="incrementItem(this, 1)" class="basket-counter">+</div>
            </div>

            <div class="col">
              <div class="title-700-20">${item.count * item.price} руб</div>
            </div>
          </div>
        </div>

        
        </div>
        `

      })

      let total = data.products.reduce((prev, curr) => {
        return prev += (curr.count * curr.price)
      }, 0)

      if (!total) {
        $($('#do-order')[0]).prop('disabled', true);
        location.href = '/shop/basket/'
      }

      $('#basket-list')[0].innerHTML = html
      $('#basket-total')[0].innerHTML = total + ' руб'
    },
  });
}