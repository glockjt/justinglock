jQuery(function($){

var BRUSHED = window.BRUSHED || {};

/* ==================================================
   Mobile Navigation
================================================== */
var mobileMenuClone = $('#menu').clone().attr('id', 'navigation-mobile');

BRUSHED.mobileNav = function(){
	var windowWidth = $(window).width();

	if( windowWidth <= 979 ) {
		if( $('#mobile-nav').length > 0 ) {
			mobileMenuClone.insertAfter('#menu');
			$('#navigation-mobile #menu-nav').attr('id', 'menu-nav-mobile');
		}
	} else {
		$('#navigation-mobile').css('display', 'none');
		if ($('#mobile-nav').hasClass('open')) {
			$('#mobile-nav').removeClass('open');
		}
	}
}

BRUSHED.listenerMenu = function(){
	$('#mobile-nav').on('click', function(e){
		$(this).toggleClass('open');

		if ($('#mobile-nav').hasClass('open')) {
			$('#navigation-mobile').slideDown(500, 'easeOutExpo');
		} else {
			$('#navigation-mobile').slideUp(500, 'easeOutExpo');
		}
		e.preventDefault();
	});

	$('#menu-nav-mobile a').on('click', function(){
		$('#mobile-nav').removeClass('open');
		$('#navigation-mobile').slideUp(350, 'easeOutExpo');
	});
}


/* ==================================================
   Slider Options
================================================== */

BRUSHED.slider = function(){
	$.supersized({
		// Functionality
		slideshow               :   1,			// Slideshow on/off
		autoplay				:	1,			// Slideshow starts playing automatically
		start_slide             :   1,			// Start slide (0 is random)
		stop_loop				:	0,			// Pauses slideshow on last slide
		random					: 	0,			// Randomize slide order (Ignores start slide)
		slide_interval          :   3000,		// Length between transitions
		transition              :   1, 			// 0-None, 1-Fade, 2-Slide Top, 3-Slide Right, 4-Slide Bottom, 5-Slide Left, 6-Carousel Right, 7-Carousel Left
		transition_speed		:	300,		// Speed of transition
		new_window				:	1,			// Image links open in new window/tab
		pause_hover             :   0,			// Pause slideshow on hover
		keyboard_nav            :   1,			// Keyboard navigation on/off
		performance				:	1,			// 0-Normal, 1-Hybrid speed/quality, 2-Optimizes image quality, 3-Optimizes transition speed // (Only works for Firefox/IE, not Webkit)
		image_protect			:	1,			// Disables image dragging and right click with Javascript

		// Size & Position
		min_width		        :   0,			// Min width allowed (in pixels)
		min_height		        :   0,			// Min height allowed (in pixels)
		vertical_center         :   1,			// Vertically center background
		horizontal_center       :   1,			// Horizontally center background
		fit_always				:	0,			// Image will never exceed browser width or height (Ignores min. dimensions)
		fit_portrait         	:   1,			// Portrait images will not exceed browser height
		fit_landscape			:   0,			// Landscape images will not exceed browser width

		// Components
		slide_links				:	'blank',	// Individual links for each slide (Options: false, 'num', 'name', 'blank')
		thumb_links				:	0,			// Individual thumb links for each slide
		thumbnail_navigation    :   0,			// Thumbnail navigation
		slides 					:  	[			// Slideshow Images
											{image : '_include/img/slider-images/slide-image1.jpg', title : '<div class="slide-content">Justin Glock</div>', thumb : '', url : ''},
											{image : '_include/img/slider-images/slide-image2.jpg', title : '<div class="slide-content">Justin Glock</div>', thumb : '', url : ''},
											{image : '_include/img/slider-images/slide-image3.jpg', title : '<div class="slide-content">Justin Glock</div>', thumb : '', url : ''},
											{image : '_include/img/slider-images/slide-image4.jpg', title : '<div class="slide-content">Justin Glock</div>', thumb : '', url : ''},
											{image : '_include/img/slider-images/slide-image5.jpg', title : '<div class="slide-content">Justin Glock</div>', thumb : '', url : ''}

									],

		// Theme Options
		progress_bar			:	0,			// Timer for each slide
		mouse_scrub				:	0

	});

}


/* ==================================================
   Navigation Fix
================================================== */

BRUSHED.nav = function(){
	$('.sticky-nav').waypoint('sticky');
}


/* ==================================================
   Filter Works
================================================== */

BRUSHED.filter = function (){
	if($('#projects').length > 0){
		var $container = $('#projects');

		$container.isotope({
		  // options
		  animationEngine: 'best-available',
		  itemSelector : '.item-thumbs',
		  layoutMode : 'fitRows'
		});


		// filter items when filter link is clicked
		var $optionSets = $('#options .option-set'),
			$optionLinks = $optionSets.find('a');

		  $optionLinks.click(function(){
			var $this = $(this);
			// don't proceed if already selected
			if ( $this.hasClass('selected') ) {
			  return false;
			}
			var $optionSet = $this.parents('.option-set');
			$optionSet.find('.selected').removeClass('selected');
			$this.addClass('selected');

			// make option object dynamically, i.e. { filter: '.my-filter-class' }
			var options = {},
				key = $optionSet.attr('data-option-key'),
				value = $this.attr('data-option-value');
			// parse 'false' as false boolean
			value = value === 'false' ? false : value;
			options[ key ] = value;
			if ( key === 'layoutMode' && typeof changeLayoutMode === 'function' ) {
			  // changes in layout modes need extra logic
			  changeLayoutMode( $this, options )
			} else {
			  // otherwise, apply new options
			  $container.isotope( options );
			}

			return false;
		});
	}
}


/* ==================================================
   FancyBox
================================================== */

BRUSHED.fancyBox = function(){
	if($('.fancybox').length > 0 || $('.fancybox-media').length > 0 || $('.fancybox-various').length > 0){

		$(".fancybox").fancybox({
				padding : 0,
				beforeShow: function () {
					this.title = $(this.element).attr('title');
					this.title = '<h4>' + this.title + '</h4>' + '<p>' + $(this.element).parent().find('img').attr('alt') + '</p>';
				},
				helpers : {
					title : { type: 'inside' },
				}
			});

		$('.fancybox-media').fancybox({
			openEffect  : 'none',
			closeEffect : 'none',
			helpers : {
				media : {}
			}
		});
	}
}


/* ==================================================
   Contact Form
================================================== */

BRUSHED.contactForm = function(){
	$("#contact-submit").on('click',function(e) {

		e.preventDefault();

		var valid = $('#contact-form').parsley('validate');

		// console.log(valid);
		var spamCheck = $('#contact_business').val();

		// // url check
		// var urlRegExp = new RegExp(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[.\!\/\\w]*))?)/);

		// var contactMessage = $('#contact_message').val();

		// var urlCheck = urlRegExp.test(contactMessage);

		// console.log($('#contact_message').val());

		// console.log('url reg ex: ', urlRegExp.test($('#contact_message').val()));

		if(valid && spamCheck === "1") {

			$contact_form = $('#contact-form');

			var fields = $contact_form.serialize();

			// console.log(fields);

			$.ajax({
				type: "POST",
				// url: "_include/php/contact.php",
				url: "/contactForm",
				data: fields,
				dataType: 'json',
				success: function(response) {

					if(response.status){
						$('#contact-form input').val('');
						$('#contact-form textarea').val('');
					}
					else
					{
						console.log("No success");
					}

					$('#response').empty().html(response.html);

					setTimeout(function(){
						$('#response').fadeOut();
					}, 1000);
				}
			});
			return false;
		} else {
			$('#contact-form input').val('');
			$('#contact-form textarea').val('');
		}
	});
}


/* ==================================================
   Twitter Feed
================================================== */

BRUSHED.tweetFeed = function(){
	var valueTop = -64;

	// $("#ticker").tweet({
	// 	  username: "JTGlock",
	// 	  page: 1,
	// 	  avatar_size: 0,
	// 	  count: 10,
	// 	  template: "{text}{time}",
	// 	  filter: function(t){ return ! /^@\w+/.test(t.tweet_raw_text); },
	// 	  loading_text: "loading ..."
	// }).bind("loaded", function() {
	//   var ul = $(this).find(".tweet_list");
	//   var ticker = function() {
	// 	setTimeout(function() {
	// 		ul.find('li:first').animate( {marginTop: valueTop + 'px'}, 500, 'linear', function() {
	// 			$(this).detach().appendTo(ul).removeAttr('style');
	// 		});
	// 	  ticker();
	// 	}, 5000);
	//   };
	//   ticker();
	// });
	console.log('tweets');
	// Added to support Twitters new API
	var tweets;
	$.ajax({
		type: "GET",
		url: "/tweet",
		dataType: "json",
		async: true,
		success: function(data) {
			console.log('data: ', data);
			tweets = data;

			$('<ul class="tweet_list"></ul>').appendTo('#ticker');
			for(var i = 0; i < tweets.length; i++) {
				// console.log(tweets[i].text);
				$('<li><span class="tweet_text">' + tweets[i].text + '</span>' +
				  '<span class="tweet_time"><a href="#" title="View tweet on twitter">' + tweets[i].time + '</a></span></li>')
				.appendTo('.tweet_list');
			}
			// $('<li><span class="tweet_text">testing1</span></li>').appendTo('.tweet_list');
			// $('<li><span class="tweet_text">testing2</span></li>').appendTo('.tweet_list');

			var ticker = $('ul.tweet_list');
			// ticker.children('li:first').addClass('tweet_first').end();

			setInterval(function() {
		    	ticker.find('li:first').animate( {marginTop: valueTop + 'px'}, 500, 'linear', function() {
					$(this).detach().appendTo(ticker).removeAttr('style');
				});
			},5000);
		},
		fail: function(error) {
			console.log('error: ', error);
		}
	});

}


/* ==================================================
   Menu Highlight
================================================== */

BRUSHED.menu = function(){
	$('#menu-nav, #menu-nav-mobile').onePageNav({
		currentClass: 'current',
		changeHash: false,
		scrollSpeed: 750,
		scrollOffset: 30,
		scrollThreshold: 0.5,
		easing: 'easeOutExpo',
		filter: ':not(.external)'
	});
}

/* ==================================================
   Next Section
================================================== */

BRUSHED.goSection = function(){
	$('#nextsection').on('click', function(){
		$target = $($(this).attr('href')).offset().top-30;

		$('body, html').animate({scrollTop : $target}, 750, 'easeOutExpo');
		return false;
	});
}

/* ==================================================
   GoUp
================================================== */

BRUSHED.goUp = function(){
	$('#goUp').on('click', function(){
		$target = $($(this).attr('href')).offset().top-30;

		$('body, html').animate({scrollTop : $target}, 750, 'easeOutExpo');
		return false;
	});
}


/* ==================================================
	Scroll to Top
================================================== */

BRUSHED.scrollToTop = function(){
	var windowWidth = $(window).width(),
		didScroll = false;

	var $arrow = $('#back-to-top');

	$arrow.click(function(e) {
		$('body,html').animate({ scrollTop: "0" }, 750, 'easeOutExpo' );
		e.preventDefault();
	})

	$(window).scroll(function() {
		didScroll = true;
	});

	setInterval(function() {
		if( didScroll ) {
			didScroll = false;

			if( $(window).scrollTop() > 1000 ) {
				$arrow.css('display', 'block');
			} else {
				$arrow.css('display', 'none');
			}
		}
	}, 250);
}

/* ==================================================
   Thumbs / Social Effects
================================================== */

BRUSHED.utils = function(){

	$('.item-thumbs').bind('touchstart', function(){
		$(".active").removeClass("active");
		$(this).addClass('active');
	});

	$('.image-wrap').bind('touchstart', function(){
		$(".active").removeClass("active");
		$(this).addClass('active');
	});

	$('#social ul li').bind('touchstart', function(){
		$(".active").removeClass("active");
		$(this).addClass('active');
	});

}

/* ==================================================
   Accordion
================================================== */

BRUSHED.accordion = function(){
	var accordion_trigger = $('.accordion-heading.accordionize');

	accordion_trigger.delegate('.accordion-toggle','click', function(event){
		if($(this).hasClass('active')){
			$(this).removeClass('active');
			$(this).addClass('inactive');
		}
		else{
			accordion_trigger.find('.active').addClass('inactive');
			accordion_trigger.find('.active').removeClass('active');
			$(this).removeClass('inactive');
			$(this).addClass('active');
		}
		event.preventDefault();
	});
}

/* ==================================================
   Toggle
================================================== */

BRUSHED.toggle = function(){
	var accordion_trigger_toggle = $('.accordion-heading.togglize');

	accordion_trigger_toggle.delegate('.accordion-toggle','click', function(event){
		if($(this).hasClass('active')){
			$(this).removeClass('active');
			$(this).addClass('inactive');
		}
		else{
			$(this).removeClass('inactive');
			$(this).addClass('active');
		}
		event.preventDefault();
	});
}

/* ==================================================
   Tooltip
================================================== */

BRUSHED.toolTip = function(){
	$('a[data-toggle=tooltip]').tooltip();
}

/* ==================================================
   Blinking Button
================================================== */

BRUSHED.blinkButton = function(){
	var x = false;

	setInterval(function() {
		$("#home-slider #nextsection").css("background-color", x ? "#26292E" : "#DE5E60");
		x = !x;
	}, 1000);
}

/* ==================================================
	RSS Feed
================================================== */

BRUSHED.rssFeed = function(){
	$('.rssfeed').rssfeed('http://thehockeywriters.com/author/jglock/feed/', {
		limit: 3,
		header: false,
		titletag: 'h3',
		linktarget: '_blank',
		dateformat: 'MMMM dd, yyyy'
	});
}

/*=====================================
=            External Link            =
=====================================*/

BRUSHED.externalLink = function() {
	var $external = $('.external');
	$external.on('click', function() {
		console.log('click!!!');
		var url = $external.attr('href');
		window.location = url;
	});
}

/*-----  End of External Link  ------*/

/* ==================================================
	PageScroller
================================================== */

BRUSHED.pageScroller = function(){
	$('body').pageScroller({
		navigation: '#menu',
		keyboardControl: true
		// scrollOffset: -40
	});
}

/* ==================================================
	Form Validation
================================================== */

BRUSHED.validateForm = function(){
	var test = $('#contact-form').isHappy({
		fields: {
			'#contact_name': {
				required: true,
				message: 'You forgot to enter your name'
			},
			'#contact_email': {
				required: true,
				message: 'Something looks wrong, please enter a valid email',
				test: happy.email
			},
			'#contact_message': {
				required: true,
				message: 'Please provide a breif message'
			}
		}
	});

	return test;
}

/* ==================================================
	Form Validation
================================================== */
BRUSHED.blogPost = function(){
	// console.log('in blog post');
	$.ajax({
		type: "GET",
		url: "/blogPost",
		dataType: 'json',
		success: function(post) {
			console.log(post);
			$('.feature-post').html(post.post.meta.title);
			$('.feature-date').html(post.post.meta.date);
			$('.feature-image').prop('src', post.post.meta.featureImage);
			$('.feature-thumb').append('<a href="blog/' + post.post.slug  + '" target="">' + post.post.meta.title + '</a>');
			$('.feature-description').html(post.post.content.replace(/<img[^>]*>/g,"").trunc(300, true));
			// $('.full-article-title').html(post.post.meta.title);
			// $('.full-article-body').html(post.post.content);
			$('#trigger-article').prop('href', '/blog/' + post.post.slug);
		}
	});

	String.prototype.trunc = function(n, useWordBoundary) {
		// this.replace(/<img[^>]*>/g, "");
		console.log('this in feature post: ', this);
		var toLong = this.length > n,
			s_ = toLong ? this.substr(0, n-1) : this;

		s_ = useWordBoundary && toLong ? s_.substr(0, s_.lastIndexOf(' ')) : s_;

		return toLong ? s_ + '&hellip;' : s_;
	};
}

/* ==================================================
	Init
================================================== */

BRUSHED.slider();

$(document).ready(function(){
	Modernizr.load([
	{
		test: Modernizr.placeholder,
		nope: '_include/js/placeholder.js',
		complete : function() {
				if (!Modernizr.placeholder) {
						Placeholders.init({
						live: true,
						hideOnFocus: false,
						className: "yourClass",
						textColor: "#999"
						});
				}
		}
	}
	]);

	// Preload the page with jPreLoader
	$('body').jpreLoader({
		splashID: "#jSplash",
		showSplash: true,
		showPercentage: true,
		autoClose: true,
		splashFunction: function() {
			$('#circle').delay(250).animate({'opacity' : 1}, 500, 'linear');
		}
	});

	BRUSHED.nav();
	BRUSHED.mobileNav();
	BRUSHED.listenerMenu();
	BRUSHED.menu();
	BRUSHED.goSection();
	BRUSHED.goUp();
	BRUSHED.filter();
	// BRUSHED.fancyBox();
	BRUSHED.contactForm();
	BRUSHED.tweetFeed();
	BRUSHED.scrollToTop();
	BRUSHED.utils();
	BRUSHED.accordion();
	BRUSHED.toggle();
	BRUSHED.toolTip();
	BRUSHED.blinkButton();
	BRUSHED.rssFeed();
	BRUSHED.externalLink();
	BRUSHED.pageScroller();
	// BRUSHED.validateForm();
	BRUSHED.blogPost();

	// leanModal
	$('#trigger-article').leanModal();
});

$(window).resize(function(){
	BRUSHED.mobileNav();
});

});
