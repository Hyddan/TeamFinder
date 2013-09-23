window.Zapto.ListAds = (function (ListAds) {
	ListAds.adCount = null;
	ListAds.adFilter = {
		loc: null,
		lf: null,
		s: null
	};
	ListAds.pageIndex = null;
	ListAds.pageSize = null;
	ListAds.pageData = null;
	
	ListAds.Elements = (function (Elements) {
		Elements.divAdContainer = null;
		Elements.divFilter = null;
		Elements.divFilterButton = null;
		Elements.divApplyFilterButton = null;
		Elements.divClearFilterButton = null;
		Elements.divPagination = null;
		Elements.selectLocation = null;
		Elements.selectLookingFor = null;
		Elements.selectSport = null;
		
		Elements.initialize = function () {
			for (var key in this) {
				if ('function' !== typeof this[key]) {
					this[key] = $('#' + key);
				}
			}
		};
		
		return Elements;
	}(ListAds.Elements || {}));
	
	ListAds.Events = (function (Events) {
		Events.onPageChanged = function (page) {
			ListAds.pageIndex = page || ListAds.pageIndex;
			
			Zapto.callServer('../data/getAdData.php', {
					loc: ListAds.adFilter.loc,
					lf: ListAds.adFilter.lf,
					s: ListAds.adFilter.s,
					pageIndex: ListAds.pageIndex - 1,
					pageSize: ListAds.pageSize,
					q: 'data'
				}, 'GET', 'json', ListAds.UI.Callbacks.adData, Zapto.handleError
			);
		};
		
		return Events;
	}(ListAds.Events || {}));
	
	ListAds.UI = (function(UI) {
		UI.Callbacks = (function (Callbacks) {
			Callbacks.adCount = function (data) {
				ListAds.adCount = parseInt(data[0].AdCount, 10) == 0 ? 1 : parseInt(data[0].AdCount, 10);
			};
			
			Callbacks.adData = function (data) {
				var _isUiAccordion = false;
				ListAds.pageData = data;
				
				try {
					_isUiAccordion = ListAds.Elements.divAdContainer.is(':ui-accordion');
				}
				catch (ex) {
					_isUiAccordion = false;
				}
				
				if (_isUiAccordion) {
					ListAds.Elements.divAdContainer.accordion('destroy');
				}
				
				ListAds.Elements.divAdContainer.html('').css('position', 'relative');
				$.each(ListAds.pageData, function (index) {
					ListAds.Elements.divAdContainer.append(UI.createHeadline(this));
					ListAds.Elements.divAdContainer.append(UI.createAdContent(this));
				});
				
				Zapto.Utils.delay.call(this, function () {
					ListAds.Elements.divAdContainer.accordion({
						active: false,
						autoHeight: false,
						collapsible: true,
						event: 'click',
						header: 'h3',
						heightStyle: 'content'
					});
				}, 'obj => !Zapto.Utils.notNullOrUndefinedFunction(obj.accordion)', ListAds.Elements.divAdContainer, 1);
			};
			
			return Callbacks;
		}(UI.Callbacks || {}));
		
		UI.createAdContent = function (data) {
			var adContentWrapper = $(document.createElement('div'));
			adContentWrapper.addClass('adContentWrapper');
			
			var adContent = $(document.createElement('div'));
			adContent.addClass('adContent');
			adContentWrapper.append(adContent);
			
			var adContentName = $(document.createElement('div'));
			adContentName.html('Name: ' + (Zapto.Utils.notNullOrEmpty(data.User.Name) ? data.User.Name : '[Unspecified]'));
			adContent.append(adContentName);
			
			var adContentAge = $(document.createElement('div'));
			adContentAge.html('Age: ' + (Zapto.Utils.notNullOrEmpty(data.User.Age) ? data.User.Age : '[Unspecified]'));
			adContent.append(adContentAge);
			
			var adContentGender = $(document.createElement('div'));
			adContentGender.html('Gender: ' + (Zapto.Utils.notNullOrEmpty(data.User.Gender) ? data.User.Gender : '[Unspecified]'));
			adContent.append(adContentGender);
			
			var adContentLookingFor = $(document.createElement('div'));
			adContentLookingFor.html('Looking for: ' + (Zapto.Utils.notNullOrEmpty(data.LookingFor.Name) ? data.LookingFor.Name : '[Unspecified]'));
			adContent.append(adContentLookingFor);
			
			var adContentDescription = $(document.createElement('div'));
			adContentDescription.html('Description: ' + (Zapto.Utils.notNullOrEmpty(data.Description) ? data.Description : '[No description]'));
			adContent.append(adContentDescription);
			
			return adContentWrapper;
		};
			
		UI.createHeadline = function (data) {
			var headline = $(document.createElement('h3'));
			headline.html(Zapto.Utils.notNullOrEmpty(data.Headline) ? data.Headline : '[No subject]');
			headline.addClass('adHeadline');
			
			var headlineInfo = $(document.createElement('span'));
			headlineInfo.html((Zapto.Utils.notNullOrEmpty(data.Sport.Name) ? data.Sport.Name : '[unspecified sport]')+ ' - ' +
								(Zapto.Utils.notNullOrEmpty(data.Location.Name) ? data.Location.Name : '[Unspecified location]'));
			headline.append(headlineInfo);
			
			return headline;
		};
		
		UI.paginate = function (pageIndex) {	
			ListAds.pageIndex = pageIndex || ListAds.pageIndex;
			
			if (ListAds.adCount) {
				if (ListAds.Elements.divPagination.hasClass('jPaginate')) {
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
					onChange				: ListAds.Events.onPageChanged
				});
			}
			else {
				Zapto.callServer('../data/getAdData.php', {
						loc: ListAds.adFilter.loc,
						lf: ListAds.adFilter.lf,
						s: ListAds.adFilter.s,
						q: 'count'
					}, 'GET', 'json', UI.Callbacks.adCount, Zapto.handleError
				);
				setTimeout(UI.paginate, 500);
			}
		};
		
		return UI;
	}(ListAds.UI || {}));
	
	ListAds.applyFilter = function () {
		ListAds.adFilter = {
			loc: Zapto.Utils.getSelectedDropDownValue(ListAds.Elements.selectLocation),
			lf: Zapto.Utils.getSelectedDropDownValue(ListAds.Elements.selectLookingFor),
			s: Zapto.Utils.getSelectedDropDownValue(ListAds.Elements.selectSport),
		}
		ListAds.adCount = null;
		ListAds.UI.paginate(1);
		ListAds.Events.onPageChanged();
		
		ListAds.Elements.divFilter.slideToggle();
	};
	
	ListAds.clearFilter = function () {
		ListAds.adFilter = {
			loc: null,
			lf: null,
			s: null
		};
		ListAds.adCount = null;
		ListAds.UI.paginate(1);
		ListAds.Events.onPageChanged();
		
		ListAds.Elements.selectLocation.selectBoxIt('selectOption', 0);
		ListAds.Elements.selectLookingFor.selectBoxIt('selectOption', 0);
		ListAds.Elements.selectSport.selectBoxIt('selectOption', 0);
		
		ListAds.Elements.divFilter.slideToggle();
	};
		
	ListAds.hasFilter = function () {
		return (ListAds.adFilter.loc != null || ListAds.adFilter.lf != null || ListAds.adFilter.s != null);
	};
	
	ListAds.loadDependencies = function () {
		Zapto.loadStyle('../lib/jquery.paginate.styles.css', null);
		Zapto.loadStyle('../css/ListAds.css', null);
	};
	
	ListAds.initialize = function () {
		Zapto.loadScript('../lib/jquery.paginate.js', function () {
			//Set initial values
			ListAds.pageSize = 5;
			ListAds.Elements.initialize();
			
			ListAds.adFilter = {
				loc: Zapto.Utils.sanitizeFilter('locations', Zapto.Utils.getQueryStringParameter('loc')),
				lf: Zapto.Utils.sanitizeFilter('lookingFor', Zapto.Utils.getQueryStringParameter('lf')),
				s: Zapto.Utils.sanitizeFilter('sports', Zapto.Utils.getQueryStringParameter('s'))
			};
			
			//Create UI elements
			ListAds.UI.paginate(1);
			ListAds.Events.onPageChanged();
			
			ListAds.Elements.selectLocation = Zapto.UI.createDropDown(ListAds.Elements.selectLocation, '../data/getAdFilterData.php', {
					q: 'locations',
					defaultText: '--Location--',
					selected: ListAds.adFilter.loc
				}
			);
			ListAds.Elements.selectLookingFor = Zapto.UI.createDropDown(ListAds.Elements.selectLookingFor, '../data/getAdFilterData.php', {
					q: 'lookingFor',
					defaultText: '--Looking For--',
					selected: ListAds.adFilter.lf
				}
			);
			ListAds.Elements.selectSport = Zapto.UI.createDropDown(ListAds.Elements.selectSport,'../data/getAdFilterData.php', {
					q: 'sports',
					defaultText: '--Sport--',
					selected: ListAds.adFilter.s
				}
			);
			
			//Hook up events
			ListAds.Elements.divFilterButton.on('click', function () {
				ListAds.Elements.divFilter.slideToggle();
			});
			
			ListAds.Elements.divApplyFilterButton.on('click', ListAds.applyFilter);
			
			ListAds.Elements.divClearFilterButton.on('click', ListAds.clearFilter);
			
			ListAds.Elements.selectLocation.on('change', function () {
				ListAds.adFilter.loc = Zapto.Utils.getSelectedDropDownValue($(this));
			});
			
			ListAds.Elements.selectLookingFor.on('change', function () {
				ListAds.adFilter.lf = Zapto.Utils.getSelectedDropDownValue($(this));
			});
			
			ListAds.Elements.selectSport.on('change', function () {
				ListAds.adFilter.s = Zapto.Utils.getSelectedDropDownValue($(this));
			});
		});
	};
	
	ListAds.loadDependencies();
	
	return ListAds;
}(window.Zapto.ListAds || {}));

Zapto.selectedMenuItem = 'menuListAds';
Zapto.ready(Zapto.ListAds.initialize);