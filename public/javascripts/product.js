function changeOptionSelect() {
  var price = +$('#price')[0].innerText
  $('#priceSelects select').each(function(index){
    price *= this.value
  })
  var result = Math.ceil(price) + ' ₽'
  $('#priceBox')[0].innerText = result
}