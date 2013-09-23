window.Zapto.Home = (function(Home) {
	Home.Elements = (function (Elements) {
		Elements.divSlideshow = null;
		Elements.formQuickSearch = null;
		Elements.selectLocation = null;
		Elements.selectLookingFor = null;
		Elements.selectSport = null;
		
		Elements.initialize = function() {
			for (var key in this) {
				if ('function' !== typeof this[key]) {
					this[key] = $('#' + key);
				}
			}
		};
		
		return Elements;
	}(Home.Elements || {}));
	
	Home.UI = (function(UI) {
		UI.adData = {
			slideshow: null
		};
		
		UI.Callbacks = (function (Callbacks) {
			Callbacks.slideshowData = function (data) {
				$.each(data, function (index) {
					UI.adData['slideshow'] = UI.adData['slideshow'] || [];
					UI.adData['slideshow'].push(this);
				});
				
				$.each(UI.adData['slideshow'], function (index) {
					var _divAdContainer = $(document.createElement('div')),
						_spanAdContent = $(document.createElement('span'));
					
					_divAdContainer.data('teamFinder-id', this.Id);
					_divAdContainer.data('teamFinder-location', this.Location.Name);
					_divAdContainer.data('teamFinder-lookingFor', this.LookingFor.Name);
					_divAdContainer.data('teamFinder-sport', this.Sport.Name);
					
					_spanAdContent.html('Looking for ' + this.Sport.Name + ' ' + this.LookingFor.Name + ' in ' + this.Location.Name);
					
					_divAdContainer.on('click', function () {
						Home.Elements.selectLocation.selectBoxIt('selectOption', Zapto.Utils.getFilterValue('locations', $(this).data('teamFinder-location')));
						Home.Elements.selectLookingFor.selectBoxIt('selectOption', Zapto.Utils.getFilterValue('lookingFor', $(this).data('teamFinder-lookingFor')));
						Home.Elements.selectSport.selectBoxIt('selectOption', Zapto.Utils.getFilterValue('sports', $(this).data('teamFinder-sport')));
						
						Home.quickSearch();
					});
					
					_divAdContainer.append(_spanAdContent).appendTo(Home.Elements.divSlideshow);
				});
				
				UI.initSlideshow();
			};
			
			return Callbacks;
		}(UI.Callbacks || {}));
		
		UI.initSlideshow = function () {
			Home.Elements.divSlideshow.find('div:gt(0)').hide();
			
			window.setInterval(function() { 
				Home.Elements.divSlideshow.find('div:first')
					.fadeOut(1000)
					.next()
					.fadeIn(1000)
					.end()
					.appendTo(Home.Elements.divSlideshow);
			},  3000);
		};
		
		return UI;
	}(Home.UI || {}));
	
	Home.initialize = function() {
		//Set initial values
		Home.Elements.initialize();
		
		//Create UI elements
		Zapto.callServer('../data/getAdData.php', { pageIndex: 0, pageSize: 3, q: 'data' }, 'GET', 'json', Home.UI.Callbacks.slideshowData, Zapto.handleError);
		
		Zapto.UI.createDropDown(Home.Elements.selectSport, '../data/getAdFilterData.php', {q: 'sports', defaultText: '--Sport--', selected: null});
		Zapto.UI.createDropDown(Home.Elements.selectLocation, '../data/getAdFilterData.php', {q: 'locations', defaultText: '--Location--', selected: null});
		Zapto.UI.createDropDown(Home.Elements.selectLookingFor, '../data/getAdFilterData.php', {q: 'lookingFor', defaultText: '--Looking For--', selected: null});
	};
	
	Home.quickSearch = function () {
		$(window.location).attr('href', '../listAds.html?' + Home.Elements.formQuickSearch.serialize());
	};
	
	return Home;
}(window.Zapto.Home || {}));

Zapto.selectedMenuItem = 'menuHome';
Zapto.ready(Zapto.Home.initialize);