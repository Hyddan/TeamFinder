window.TeamFinder.Home = (function(Home) {
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
						_spanAdContent = $(document.createElement('span')),
						_spanAdHeader = $(document.createElement('span')),
						_spanAdLookingFor = $(document.createElement('span'));
					
					_divAdContainer.data('teamFinder-id', this.Id);
					
					_spanAdHeader.html('Headline: ' + this.Headline + '<br />');
					_spanAdContent.html('Description: ' + this.Description + '<br />');
					_spanAdLookingFor.html('Looking for ' + this.Sport.Name + ' ' + this.LookingFor.Name + ' in ' + this.Location.Name);
					
					_divAdContainer.on('click', function () {
						Home.deepLink($(this).data('teamFinder-id'));
					});
					
					_divAdContainer.append(_spanAdHeader).append(_spanAdContent).append(_spanAdLookingFor).appendTo(Home.Elements.divSlideshow);
				});
				
				UI.initSlideshow();
			};
			
			return Callbacks;
		}(UI.Callbacks || {}));
		
		UI.initSlideshow = function () {
			Home.Elements.divSlideshow.find('div:gt(0)').hide();
			
			window.setInterval(function() { 
				Home.Elements.divSlideshow.find('div:first')
					.fadeOut(100)
					.next()
					.fadeIn(1000)
					.end()
					.appendTo(Home.Elements.divSlideshow);
			},  3000);
		};
		
		return UI;
	}(Home.UI || {}));
	
	Home.deepLink = function (index) {
		$(window.location).attr('href', '../listAds.html?i=' + index);
	};
	
	Home.initialize = function() {
		//Set initial values
		Home.Elements.initialize();
		
		//Create UI elements
		TeamFinder.callServer('../data/getAdData.php', { pageIndex: 0, pageSize: 3, q: 'data' }, 'GET', 'json', Home.UI.Callbacks.slideshowData, TeamFinder.handleError);
		
		TeamFinder.UI.createDropDown(Home.Elements.selectSport, '../data/getAdFilterData.php', {q: 'sports', defaultText: '--Sport--', selected: null});
		TeamFinder.UI.createDropDown(Home.Elements.selectLocation, '../data/getAdFilterData.php', {q: 'locations', defaultText: '--Location--', selected: null});
		TeamFinder.UI.createDropDown(Home.Elements.selectLookingFor, '../data/getAdFilterData.php', {q: 'lookingFor', defaultText: '--Looking For--', selected: null});
	};
	
	Home.quickSearch = function () {
		$(window.location).attr('href', '../listAds.html?' + Home.Elements.formQuickSearch.serialize());
	};
	
	return Home;
}(window.TeamFinder.Home || {}));

TeamFinder.selectedMenuItem = 'menuHome';
TeamFinder.ready(TeamFinder.Home.initialize);