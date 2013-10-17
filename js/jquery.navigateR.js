/*
 * jQuery navigateR Plugin 1.0
 * 
 * Copyright 2012, Daniel Hedenius
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

(function ($){
	var navigateR = function (element, options) {
		this.element = element;
		this.jqElement = $(element);
		this.options = options;
		this.metadata = this.jqElement.data( 'navigateR-options' );
	};

	navigateR.prototype = {
		defaults: {
			containerClass		: 'navigateR',
			delay				: 150,
			itemClass			: 'navigateR-item',
			multiplier			: .8,
			padIn  				: 15,
			padOut 				: 40
		},
		init: function () {
			var _timer = 0,
				self = this;
				
			self.config = $.extend({}, self.defaults, self.options, self.metadata);
			
			self.jqElement.addClass(self.config.containerClass);
			self.jqElement.children('li').each(function (i)
			{
				_timer = _timer * self.config.multiplier + self.config.delay;
				
				$(this).addClass(self.config.itemClass).css("margin-left","-180px");
				$(this).animate({ marginLeft: "0" }, _timer).animate({ marginLeft: self.config.padIn + "px" }, _timer).animate({ marginLeft: "0" }, _timer);
			});
			
			self.jqElement.children('li').children('div').each(function (i)
			{
				$(this).on('mouseenter', function () {
					$(this).animate({ paddingLeft: self.config.padOut }, 150);
				}).on('mouseleave', function () {
					$(this).animate({ paddingLeft: self.config.padIn }, 150);
				});
			});
			
			return self;
		}
	}

	navigateR.defaults = navigateR.prototype.defaults;

	$.fn.navigateR = function (options) {
		return this.each(function () {
			new navigateR(this, options).init();
		});
	};
})(jQuery);