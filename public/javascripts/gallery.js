var block_show = false;
const limit = 12

function scrollMore(){
	var $target = $('#showmore_triger');
	
	if (block_show) {
		return false;
	}
 
	var wt = $(window).scrollTop();
	var wh = $(window).height();
	var et = $target.offset()?.top;
	var eh = $target.outerHeight();
	var dh = $(document).height();   
	if (wt + wh >= et || wh + wt == dh || eh + et < wh){
    var page = $target.attr('data-page');	
		
		block_show = true;

		$.ajax({ 
			url: `/api/files/gallery?page=${page}&limit=${limit}`,  
			dataType: 'json',
			success: function(data) {
				block_show = false;
        console.log(data)
        for (const item of data) {
          $('#gallery_container').append(
          `<div class="col-12 col-md-6 col-lg-4 col-xl-3">
              <div class="box_1-1 mb-4">
                <img src=${item.path} alt=${item.text} class="review__image">
              </div>
            </div>`
          )
        }
        page++;
        $target.attr('data-page', page)

        if (data.length < limit) {
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