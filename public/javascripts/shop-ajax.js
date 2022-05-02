var block_show = false;

function scrollMore(){
	var $target = $('#showmore-triger');
	
	if (block_show) {
		return false;
	}
 
	var wt = $(window).scrollTop();
	var wh = $(window).height();
	var et = $target.offset()?.top;
	var eh = $target.outerHeight();
	var dh = $(document).height();   
	if (wt + wh >= et || wh + wt == dh || eh + et < wh){
		var path = window.location.pathname.slice(6)
    var page = $target.attr('data-page');	
		page++;
		block_show = true;

		$.ajax({ 
			url: `/api/shops/products/${path}?offset=${page}`,  
			dataType: 'json',
			success: function(data) {
				block_show = false;

        for (const product of data.products) {
          $('#shop_container').append(
          `<div class="col-sm-6 col-md-4 col-lg-3 col-xs-12">
              <div class="product__border">
                <a class="product__inner" href="/product/${product.path}">
                  <div class="product__group">
                    <h5 class="text-ellipsis mh-h5-2 text-green"> ${product.group}</h5>
                  </div>
                  <div class="product__image">
                    <img class="img__product" src="${product.image ? product.image : '/images/box-icon.svg'}" />
                  </div>
                  <div class="product__text">
                    <h4 class="product__price orange-text">${product.options && product.options.length ? 'От' : ''} ${product.price} ₽ </h4>
                    <h4 class="product__content marck-script text-green">${product.name} </h4>
                  </div>
                </a>
              </div>
            </div>`
          )
        }
        $target.attr('data-page', page)

        if (data.products.length < 20) {
          $target.remove();
        }
			}
		});
	}
}
 
$(window).scroll(function(){
	scrollMore();
});
	
$(document).ready(function(){ 
	scrollMore();
});