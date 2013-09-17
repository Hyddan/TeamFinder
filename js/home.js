window.Zapto.Home = (function(Home) {
	Home.UI = (function(UI) {
		UI.initdivSlideshow = function () {
			$("#divSlideshow > div:gt(0)").hide();
			
			setInterval(function() { 
				$('#divSlideshow > div:first')
				.fadeOut(1000)
				.next()
				.fadeIn(1000)
				.end()
				.appendTo('#divSlideshow');
			},  3000);
			
			Zapto.callServer('../data/getAdData.php', { pageIndex: 0, pageSize: 3, q: 'data' }, 'GET', 'json', UI.divSlideshowDataCallback, Zapto.handleError);
		};
		
		UI.divSlideshowDataCallback = function (data) {
			$.each(data, function () {
				$('#tableSlider').append("<tr><td>" + this.Headline + "</td><td>" + this.Sport.Name + "</td><td>" + this.Location.Name + "</td></tr>");
			});
		};
		
		return UI;
	}(Home.UI || {}));
	
	Home.quickSearch = function () {
		$(window.location).attr('href', '../listAds.html?' + Home.Elements.formQuickSearch.serialize());
	};
	
	Home.initialize = function() {
		//Set initial values
		Home.Elements.initialize();
		
		//Create UI elements
		Home.UI.initdivSlideshow();
		
		Zapto.UI.createDropDown(Home.Elements.selectSport, '../data/getAdFilterData.php', {q: 'sports', defaultText: '--Sport--', selected: null});
		Zapto.UI.createDropDown(Home.Elements.selectLocation, '../data/getAdFilterData.php', {q: 'locations', defaultText: '--Location--', selected: null});
		Zapto.UI.createDropDown(Home.Elements.selectLookingFor, '../data/getAdFilterData.php', {q: 'lookingFor', defaultText: '--Looking For--', selected: null});
	};
	
	Home.Elements = (function (Elements) {
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
	
	return Home;
}(window.Zapto.Home || {}));

Zapto.selectedMenuItem = 'menuHome';
Zapto.ready(Zapto.Home.initialize);