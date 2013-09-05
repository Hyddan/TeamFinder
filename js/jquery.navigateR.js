/*
 * jQuery navigateR Plugin 1.0
 * 
 * Copyright 2012, Daniel Hedenius
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

(function ($){
	var navigateR = function (elem, options) {
		this.elem = elem;
		this.jqElem = $(elem);
		this.options = options;
		this.metadata = this.jqElem.data( 'navigateR-options' );
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
			var timer = 0,
				self = this;
				
			self.config = $.extend({}, self.defaults, self.options, self.metadata);
			
			self.jqElem.addClass(self.config.containerClass);
			self.jqElem.children('li').each(function (i)
			{
				$(this).addClass(self.config.itemClass);
				$(this).css("margin-left","-180px");
				timer = (timer * self.config.multiplier + self.config.delay);
				$(this).animate({ marginLeft: "0" }, timer);
				$(this).animate({ marginLeft: self.config.padIn + "px" }, timer);
				$(this).animate({ marginLeft: "0" }, timer);
			});
			
			self.jqElem.children('li').children('div').each(function (i)
			{
				$(this).hover(function () {
					$(this).animate({ paddingLeft: self.config.padOut }, 150);
				}, function () {
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