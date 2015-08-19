
	$(document).ready(function() {
		Dropdowns.init();
		Obstacles.init();
	});
	
	window.onresize = function() {
		 stretchCheckerboard();
	}
	
	window.onload = function() {
		stretchCheckerboard();
		if (!$.support.placeholder) activatePlaceholders();
	}

	
	/* Detect placeholder attribute support */
	
	$.support.placeholder = (function(){
	    var i = document.createElement('input');
	    return 'placeholder' in i;
	})();


	/*
	 * Animated scroll to anchors
	 */ 
	
	if(screen.width > 1024) {
		$('nav a').click(function() {
			id = $(this).attr('href');
			offset = $(id).offset();
			$('html,body').animate({ scrollTop: offset.top }, 1000, function() {
				window.location = id;
			});
			return false;
		});
	}


	/*
	 * Stretches the checkerboard background to equal checks
	 */

	function stretchCheckerboard() {
		y = $('.main-section .wrapper').outerWidth();		
		$('.main-section header h3').each(function() {
			w = $(this).outerWidth();
			$(this).css({  marginRight: (y-w)%40 });
		});
		
	}

	
	/*
	 * Makes the navigation sticky
	 */
	
	function stickyNav() {
		pos = $(window).scrollTop();
		if (pos > 0) {
			$('nav').addClass('scroll').css({ position: 'absolute', top: pos }).fadeIn();
		} else {
			$('nav').removeClass('scroll').css({ position: 'absolute', top: 0 }).show();
		}
	}
	
	var didScroll = false;		
	$(window).scroll(function() {
		$('nav').hide();
		if (!didScroll) {
			timer = setInterval(function() {
				if (didScroll) {
					didScroll = false;
					clearTimeout(timer);
					stickyNav();
				}
			}, 1000);			
		}			
		didScroll = true;
	});

	
	/*
	 * Mimics the placeholder attribute in older browsers
	 */

	function activatePlaceholders() {
	
		$('input').each(function() {
			if ($(this).attr('type') == 'text' || $(this).attr('type') == 'email' || $(this).attr('type') == 'url') {
				var placeholder = $(this).attr('placeholder');
				if (placeholder.length) {
					$(this).val(placeholder);
					$(this).click(function() {
						if ($(this).val(placeholder)) {
							$(this).val('');
						}
						return false;
					});
					$(this).blur(function() {
						if ($(this).val().length < 1) {
							$(this).val(placeholder);
						}
					});
				}
			}
		});
	}
	
	
	/*
	 * Makes the obstacles huge
	 */

	var Obstacles = {};	
	(function(context) {
	
		var $obstacles = $('#obstacles');
		var $hugeacle;
	
		context.init = function() {
		
			if ($('.hugeacle').length == 0) {
				$('<div class="hugeacle" />').appendTo( $obstacles.find('.wrapper') );
				$hugeacle = $('.hugeacle');
				context.makeHughe($obstacles.find('li:first'));
			}
			
			$obstacles.find('li').click(function() {				
				context.makeHughe($(this));
			});
		
		};
		
		context.makeHughe = function($obj) {
			$obj.addClass('active').siblings().removeClass('active');
			html = $obj.html();
			$hugeacle.html(html);
		
		};
	
	})(Obstacles);


	/*
	 * Custom drop downs
	 */

	var Dropdowns = {};	
	(function(context) {	
	
		var $dd;
	
		context.init = function() {
		
			ua = $.browser;
			if (ua.msie && ua.version.slice(0,3) == '6.0') return false;
		
			$sl = $('.sl');
			$sl.find('select').addClass('hide');
			$sl.find('.drop').show();

			$('.drop').find('span').click(function(e) {				
				$dd = $(this).parent().find('ul');
				$(this).closest('form').find('ul').not($dd).hide();	
				$dd.toggle();
				return false;
			});
			
			$('.drop').find('li').click(function(e) {
				val = $(this).text();
				$(this).closest('.sl').find('select').val(val);
				$(this).closest('.sl').find('.drop span').text(val);
				context.close($('.drop'));
				return false;
			});

			$('select').focus(function() {				
				$(this).next('.drop').focus();
			});
			
			$('.drop').keydown(function(e) {
				context.keyboardNav($(this), e);
			});
			
			$('.drop').blur(function() {
				context.close($('.drop'));
			});	
			
		};
					
		context.keyboardNav = function($obj, e) {
		
			$ul = $obj.find('ul');
			$sel = $ul.find('li.sel');
			
			switch(e.keyCode) {
				case 40:
					$ul.show();
					
					if ($sel.is(':last-child')) {
						e.preventDefault();
						return false;
					}
					
					if ($sel.length) {
						$sel.removeClass('sel').next().addClass('sel');
					} else {
						$ul.find('li:first').addClass('sel');
					}
					
					e.preventDefault();
					break;
				case 38:
					if ($sel.is(':first-child')) {
						e.preventDefault();
						return false;
					}
					
					$sel.removeClass('sel').prev().addClass('sel');						
					e.preventDefault();
					break;
				case 13:
					$sel = $ul.find('li.sel');
					context.setValue($sel);
					context.close($obj);					
					e.preventDefault();
					break;
				case 27:
					context.close($obj);
					break;
				case 9:
					if(e.shiftKey) {
						$obj.parent().find(':input').focus();
					}
					break;
			}
			
		};
		
		context.close = function($obj) {
				
			$ul = $obj.find('ul');				
			$ul.find('li').removeClass('sel');
			$ul.hide();

		};
		
		context.setValue = function($obj) {
		
			val = $obj.text()
			$obj.closest('.sl').find('select').val(val);
			$obj.closest('.sl').find('.drop span').text(val);
			$obj.closest('.sl').find('.drop ul').hide();				
			$obj.removeClass('sel');
		
		};
	
	})(Dropdowns);	