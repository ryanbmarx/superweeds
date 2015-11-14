$(document).ready(function(){

	function stickFarm(){
			// make farm sticky. It will track the position of the 
			// scroller's left edge, the move the farm container 
			// to that point (position:fixed)

			var windowWidth = $(window).width();
			if (windowWidth > 767){
				var $farm = $('.farm-outer'),
				$scroller = $('.scroller-outer'),
				$scrollerOffset = $scroller.offset().left,
				$farmWidth = $farm.width();
				$farm.addClass('sticky').css('left', $scrollerOffset-$farmWidth);
			}
		}
		stickFarm();
		var timedStickFarm = _.debounce(stickFarm, 300);
		$(window).resize(timedStickFarm);


		var offsetPosition = $('.farm-inner .farm-bg').height() + $('.navbar-fixed-top').height();
		console.log('Waypoints offset is ' + offsetPosition);
		// This is the basic waypoints init.
		// var waypoint = new Waypoint({
		// 	element: document.getElementsByClassName('blurb-wrapper'),
		// 	handler: function() {
		// 		console.log(this);
		// 	}
		// })
	var waypoints = $('.blurb-wrapper').waypoint({
		handler:function(direction){
			var triggeredPoint = this.element.id
			$('body').attr('data-triggered', triggeredPoint);
			$('.blurb-wrapper.active').removeClass('active');
			$(this.element).addClass('active');
			console.log(this.element.id,direction);
		}, offset:offsetPosition
	});


/*

	//ACTIVATE THE WAYPOINTS ON DOT BAR NAV
	$('.timeline-wrapper').waypoint(function(direction){
		var current = $(this).attr('id');
		$('a.dot').each(function(){
			var dot = $(this).attr('href');
			if (dot == '#'+current){
				$(this).addClass('active');
			} else {
				$(this).removeClass('active');
			}
		});
	}, {offset:wayOffset});

	*/

	});