window.Zapto.Home = (function(Home) {
	Home.UI = (function(UI) {
		UI.initSlideshow = function () {
			$("#slideshow > div:gt(0)").hide();
			
			setInterval(function() { 
				$('#slideshow > div:first')
				.fadeOut(1000)
				.next()
				.fadeIn(1000)
				.end()
				.appendTo('#slideshow');
			},  3000);
			
			Zapto.callServer('data/getAdData.php', { pageIndex: 0, pageSize: 3, q: 'data' }, 'GET', 'json', UI.slideshowDataCallback, Zapto.handleError);
		};
		
		UI.slideshowDataCallback = function (data) {
			$.each(data, function () {
				$('#slider_table').append("<tr><td>" + this.Headline + "</td><td>" + this.Sport.Name + "</td><td>" + this.Location.Name + "</td></tr>");
			});
		};
		
		return UI;
	}(Home.UI || {}));
	
	Home.quickSearch = function () {
		var queryStringParams = CreateAd.Elements.formQuickSearch.serialize();
		$(window.location).attr('href', '../listAds.html?' + queryStringParams);
	};
	
	Home.initialize = function() {
		//Set initial values
		Home.Elements.initialize();
		
		//Create UI elements
		Home.UI.initSlideshow();
		
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
			Elements.formQuickSearch = $('#formQuickSearch');
			Elements.selectLocation = $('#selectLocation');
			Elements.selectLookingFor = $('#selectLookingFor');
			Elements.selectSport = $('#selectSport');
		};
		
		return Elements;
	}(Home.Elements || {}));
	
	return Home;
}(window.Zapto.Home || {}));

Zapto.selectedMenuItem = 'menuHome';
Zapto.ready(Zapto.Home.initialize);