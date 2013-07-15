window.Zapto.ListAds = (function(ListAds) {
	ListAds.adCount = null;
	ListAds.adFilter = {
		c: null,
		l: null,
		s: null
	};
	ListAds.pageIndex = null;
	ListAds.pageSize = null;
	ListAds.pageData = null;
	
	ListAds.adCountCallback = function(data) {
		ListAds.adCount = parseInt(data[0].AdCount, 10) == 0 ? 1 : parseInt(data[0].AdCount, 10);
	};
	
	ListAds.applyFilter = function() {
		ListAds.adFilter = {
			c: Zapto.Utils.getSelectedDropDownValue(ListAds.Elements.selectLocation),
			l: Zapto.Utils.getSelectedDropDownValue(ListAds.Elements.selectLookingFor),
			s: Zapto.Utils.getSelectedDropDownValue(ListAds.Elements.selectSport),
		}
		ListAds.adCount = null;
		ListAds.paginate(1);
		ListAds.pageChanged();
		
		ListAds.Elements.divFilter.slideToggle();
	};
	
	ListAds.clearFilter = function() {
		ListAds.adFilter = {
			c: null,
			l: null,
			s: null
		};
		ListAds.adCount = null;
		ListAds.paginate(1);
		ListAds.pageChanged();
		
		ListAds.Elements.selectLocation.selectBoxIt('selectOption', 0);
		ListAds.Elements.selectLookingFor.selectBoxIt('selectOption', 0);
		ListAds.Elements.selectSport.selectBoxIt('selectOption', 0);
		
		ListAds.Elements.divFilter.slideToggle();
	};
	
	ListAds.createAdContent = function(data) {
		var adContentWrapper = $(document.createElement('div'));
		adContentWrapper.addClass('adContentWrapper');
		
		var adContent = $(document.createElement('div'));
		adContent.addClass('adContent');
		adContentWrapper.append(adContent);
		
		var adContentName = $(document.createElement('div'));
		adContentName.html('Name: ' + (Zapto.Utils.notNullOrEmpty(data.name) ? data.name : '[Unspecified]'));
		adContent.append(adContentName);
		
		var adContentAge = $(document.createElement('div'));
		adContentAge.html('Age: ' + (Zapto.Utils.notNullOrEmpty(data.age) ? data.age : '[Unspecified]'));
		adContent.append(adContentAge);
		
		var adContentGender = $(document.createElement('div'));
		adContentGender.html('Gender: ' + (Zapto.Utils.notNullOrEmpty(data.gender) ? data.gender : '[Unspecified]'));
		adContent.append(adContentGender);
		
		var adContentLookingFor = $(document.createElement('div'));
		adContentLookingFor.html('Looking for: ' + (Zapto.Utils.notNullOrEmpty(data.looking_for) ? data.looking_for : '[Unspecified]'));
		adContent.append(adContentLookingFor);
		
		var adContentDescription = $(document.createElement('div'));
		adContentDescription.html('Description: ' + (Zapto.Utils.notNullOrEmpty(data.ad_text) ? data.ad_text : '[No description]'));
		adContent.append(adContentDescription);
		
		return adContentWrapper;
	};
		
	ListAds.createHeadline = function(data) {
		var headline = $(document.createElement('h3'));
		headline.html(Zapto.Utils.notNullOrEmpty(data.headline) ? data.headline : '[No subject]');
		headline.addClass('adHeadline');
		
		var headlineInfo = $(document.createElement('span'));
		headlineInfo.html((Zapto.Utils.notNullOrEmpty(data.sport) ? data.sport : '[unspecified sport]')+ ' - ' +
							(Zapto.Utils.notNullOrEmpty(data.location) ? data.location : '[Unspecified location]'));
		headline.append(headlineInfo);
		
		return headline;
	};
	
	ListAds.getAdsCallback = function(data) {
		ListAds.pageData = data;
		if(ListAds.Elements.divAdContainer.is(':ui-accordion')) {
			ListAds.Elements.divAdContainer.accordion('destroy');
		}
		ListAds.Elements.divAdContainer.html('').css('position', 'relative');
		$.each(ListAds.pageData, function(index) {
			ListAds.Elements.divAdContainer.append(ListAds.createHeadline(this));
			ListAds.Elements.divAdContainer.append(ListAds.createAdContent(this));
		});
		
		ListAds.Elements.divAdContainer.accordion({
			active: false,
			autoHeight: false,
			collapsible: true,
			event: 'click',
			header: 'h3',
			heightStyle: 'content'
		});
	};
		
	ListAds.hasFilter = function() {
		if(ListAds.adFilter.c != null || ListAds.adFilter.l != null || ListAds.adFilter.s != null) {
			return true;
		}
		
		return false;
	};
	
	ListAds.loadDependencies = function() {
		Zapto.loadStyle('lib/jquery.paginate.styles.css', null);
		Zapto.loadStyle('css/ListAds.css', null);
	};
	
	ListAds.paginate = function(pageIndex) {	
		ListAds.pageIndex = pageIndex || ListAds.pageIndex;
		
		if(ListAds.adCount) {
			if(ListAds.Elements.divPagination.hasClass('jPaginate')) {
				ListAds.Elements.divPagination.removeClass('jPaginate');
				ListAds.Elements.divPagination.attr('style', '');
				ListAds.Elements.divPagination.html('');
			}
			
			ListAds.Elements.divPagination.paginate({
				count 					: Math.ceil((ListAds.adCount / ListAds.pageSize)),
				start 					: ListAds.pageIndex,
				display     			: 5,
				border					: false,
				text_color  			: '#c4d92e',
				background_color    	: 'black',
				text_hover_color  		: '#fff',
				background_hover_color	: '#000',
				images					: false,
				mouse					: 'press',
				onChange				: ListAds.pageChanged
			});
		}
		else {
			Zapto.callServer('bin/getAdData.php', {
					c: ListAds.adFilter.c,
					l: ListAds.adFilter.l,
					s: ListAds.adFilter.s,
					q: 'count'
				}, 'GET', 'json', ListAds.adCountCallback, Zapto.handleError
			);
			setTimeout(ListAds.paginate, 500);
		}
	};
	
	ListAds.pageChanged = function(page) {
		ListAds.pageIndex = page || ListAds.pageIndex;
		
		Zapto.callServer('bin/getAdData.php', {
				c: ListAds.adFilter.c,
				l: ListAds.adFilter.l,
				s: ListAds.adFilter.s,
				pageIndex: ListAds.pageIndex - 1,
				pageSize: ListAds.pageSize,
				q: 'data'
			}, 'GET', 'json', ListAds.getAdsCallback, Zapto.handleError
		);
	};
	
	ListAds.initialize = function() {
		Zapto.loadScript('lib/jquery.paginate.js', function() {
			//Set initial values
			ListAds.pageSize = 5;
			ListAds.Elements.initialize();
			
			ListAds.adFilter = {
				c: Zapto.Utils.sanitizeFilter('cities', Zapto.Utils.getQueryStringParameter('c')),
				l: Zapto.Utils.sanitizeFilter('lookingFor', Zapto.Utils.getQueryStringParameter('l')),
				s: Zapto.Utils.sanitizeFilter('sports', Zapto.Utils.getQueryStringParameter('s'))
			};
			
			//Create UI elements
			ListAds.paginate(1);
			ListAds.pageChanged();
			
			ListAds.Elements.selectLocation = Zapto.UI.createDropDown(ListAds.Elements.selectLocation, 'bin/getAdFilterData.php', {
					q: 'cities',
					defaultText: '--Location--',
					selected: ListAds.adFilter.c
				}
			);
			ListAds.Elements.selectLookingFor = Zapto.UI.createDropDown(ListAds.Elements.selectLookingFor, 'bin/getAdFilterData.php', {
					q: 'lookingFor',
					defaultText: '--Looking For--',
					selected: ListAds.adFilter.l
				}
			);
			ListAds.Elements.selectSport = Zapto.UI.createDropDown(ListAds.Elements.selectSport,'bin/getAdFilterData.php', {
					q: 'sports',
					defaultText: '--Sport--',
					selected: ListAds.adFilter.s
				}
			);
			
			//Hook up events
			ListAds.Elements.divFilterButton.on('click', function() {
				ListAds.Elements.divFilter.slideToggle();
			});
			
			ListAds.Elements.divApplyFilterButton.on('click', ListAds.applyFilter);
			
			ListAds.Elements.divClearFilterButton.on('click', ListAds.clearFilter);
			
			ListAds.Elements.selectLocation.on('change', function() {
				ListAds.adFilter.c = Zapto.Utils.getSelectedDropDownValue($(this));
			});
			
			ListAds.Elements.selectLookingFor.on('change', function() {
				ListAds.adFilter.l = Zapto.Utils.getSelectedDropDownValue($(this));
			});
			
			ListAds.Elements.selectSport.on('change', function() {
				ListAds.adFilter.s = Zapto.Utils.getSelectedDropDownValue($(this));
			});
		});
	};
	
	ListAds.Elements = (function(Elements) {
		Elements.divAdContainer = null;
		Elements.divFilter = null;
		Elements.divFilterButton = null;
		Elements.divApplyFilterButton = null;
		Elements.divClearFilterButton = null;
		Elements.divPagination = null;
		Elements.selectLocation = null;
		Elements.selectLookingFor = null;
		Elements.selectSport = null;
		
		Elements.initialize = function() {
			Elements.divAdContainer = $('#divAdContainer');
			Elements.divFilter = $('#divFilter');
			Elements.divFilterButton = $('#divFilterButton');
			Elements.divApplyFilterButton = $('#divApplyFilterButton');
			Elements.divClearFilterButton = $('#divClearFilterButton');
			Elements.divPagination = $('#divPagination');
			Elements.selectLocation = $('#selectLocation');
			Elements.selectLookingFor = $('#selectLookingFor');
			Elements.selectSport = $('#selectSport');
		};
		
		return Elements;
	}(ListAds.Elements || {}));
	
	ListAds.loadDependencies();
	
	return ListAds;
}(window.Zapto.ListAds || {}));

Zapto.selectedMenuItem = 'menuListAds';
Zapto.ready(Zapto.ListAds.initialize);