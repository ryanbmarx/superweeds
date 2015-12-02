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

		var offsetDown = $('.farm-inner').outerHeight()/2 + $('.navbar-fixed-top').height();
		console.log('Waypoints offsetDown is ' + offsetDown);

		var waypointsDown = $('.blurb-wrapper').waypoint(function(direction){
			console.log(this.element.id,direction);
			if(direction == "down"){
				if($('.keep-scrolling-wrapper').is(":visible")){
					$('.keep-scrolling-wrapper').slideUp(500).fadeOut(500);
				}
				var triggeredPoint = this.element.id
				$('body').attr('data-triggered', "XXX");
				setTimeout(function() {
				    $('body').attr('data-triggered', triggeredPoint);
				},1);
				$('.blurb-wrapper.active').removeClass('active');
				$(this.element).addClass('active');
			}
		}, {
			offset:offsetDown,
			continuous: false
		});
		var waypointsUp = $('.blurb-wrapper').waypoint(function(direction){
			console.log(this.element.id,direction);
			if(direction == "up"){
								if($('.keep-scrolling-wrapper').is(":visible")){
					$('.keep-scrolling-wrapper').slideUp(500).fadeOut(500);
				}
				var triggeredPoint = this.element.id
				$('body').attr('data-triggered', "XXX");
				setTimeout(function() {
				    $('body').attr('data-triggered', triggeredPoint);
				},1);

				$('.blurb-wrapper.active').removeClass('active');
				$(this.element).addClass('active');
			}
		}, {
			offset:function(){
				return (-this.element.clientHeight) + offsetDown;
			},
			continuous: false
		});

		$('#palmer-map').makePanels({
		type:"none",    /* Options are "none", "buttons" or "dropdown" */
		transitionSpeed: 150, /* 0=instant, 1000 = 1 second */
		showForwardBackButtons:true, /* duh! */
		alignNav:"center" /* Also can be "left" */
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