(function($){
	var navigateR = function(elem, options) {
		this.elem = elem;
		this.$elem = $(elem);
		this.options = options;
		this.metadata = this.$elem.data( 'navigateR-options' );
	};

	navigateR.prototype = {
		defaults: {
			containerClass		: 'navigateR',
			itemClass			: 'navigateR-item',
			padOut 				: 40,
			padIn  				: 15,
			delay				: 150,
			multiplier			: .8
		},
		init: function() {
			var timer = 0,
				self = this;
				
			self.config = $.extend({}, self.defaults, self.options, self.metadata);
			
			self.$elem.addClass(self.config.containerClass);
			self.$elem.children('li').each(function(i)
			{
				$(this).addClass(self.config.itemClass);
				$(this).css("margin-left","-180px");
				timer = (timer*self.config.multiplier + self.config.delay);
				$(this).animate({ marginLeft: "0" }, timer);
				$(this).animate({ marginLeft: self.config.padIn + "px" }, timer);
				$(this).animate({ marginLeft: "0" }, timer);
			});
			self.$elem.children('li').children('div').each(function(i)
			{
				$(this).hover(
				function()
				{
					$(this).animate({ paddingLeft: self.config.padOut }, 150);
				},		
				function()
				{
					$(this).animate({ paddingLeft: self.config.padIn }, 150);
				});
			});
			
			return self;
		}
	}

	navigateR.defaults = navigateR.prototype.defaults;

	$.fn.navigateR = function(options) {
		return this.each(function() {
			new navigateR(this, options).init();
		});
	};
})(jQuery);