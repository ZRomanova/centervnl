
$('.donate-circle').click(function() {
  clickDonate(this)
})

$('.donate-text').click(function() {
  clickDonate(this)
})

const clickDonate = function(element) {
  $('.donate-box').removeClass('active')
  var elParent = $(element).parent().addClass('active')
  var index = elParent.index()
  $('.donate-content').removeClass('d-block')
  $('.donate-content').addClass('d-none')
  $($('.donate-content')[index]).addClass('d-block')
  $($('.donate-content')[index]).removeClass('d-none')
}