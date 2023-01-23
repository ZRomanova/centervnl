function changeOptionSelect() {
  var price = +($('#price-start')[0].innerText)
  $('#priceSelects select').each(function(index){
    price *= this.value
  })
  var count = $('#count-products')[0].value ? +($('#count-products')[0].value) : 1
  if (count < 1) {
    $('#count-products')[0].value = 1
    count = 1
  }
  var result = Math.ceil(price)
  result *= count
  $('#price')[0].innerText = result
}

function addToBasket() {
  const basket = {options: []}
  basket.product = $('#product-id')[0].innerText
  $('#priceSelects select').each(function(i){
    $('.price-option', this).each(function(index) {
      if (this.selected) {
        basket.options.push(this.id)
      }
    })
  })
  var count = +($('#count-products')[0].value)
  basket.count = (count && count > 0) ? count : 1

  $.ajax({
    type: "POST",
    dataType: 'json',
    url: '/api/orders',
    data: basket,
    success: function(data) {
      const basket = basketFormat(data)
      $('#basket-lg .basket-text .text-600-12')[0].innerText = basket.count + ' ' + basket.text
      $('#basket-lg .basket-text .text-600-12-orange')[0].innerText = basket.price + ' руб'
      $('#basket-sm .basket-circle .basket-sm-text')[0].innerText = basket.count
    },
  });
}

const basketFormat = (basket) => {
  let products = []
  if (basket && basket.products && basket.products.length) {
      products = basket.products
  } 
  let price_all = 0
  let count_all = 0
  products.forEach(item => {
      count_all += item.count
      price_all += item.price * item.count
  })

  let product_text = 'товар'
  let count_text = String(count_all)

  if  ( ['11', '12', '13', '14'].includes(count_text.slice(-2))) {
      product_text+= 'ов'
  } 
  else if (['1'].includes(count_text.slice(-1))) {

  } else if (['2', '3', '4'].includes(count_text.slice(-2))) {
      product_text+= 'а'
  } else {
      product_text+= 'ов'
  }
  return {
      text: product_text, price: price_all, count: count_all
  }
}
