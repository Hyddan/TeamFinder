window.TeamFinder.ListAds = (function (ListAds) {
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
			
			TeamFinder.callServer('../data/getAdData.php', {
					loc: ListAds.adFilter.loc,
					lf: ListAds.adFilter.lf,
					s: ListAds.adFilter.s,
					pageIndex: ListAds.pageIndex - 1,
					pageSize: ListAds.pageSize,
					q: 'data'
				}, 'GET', 'json', ListAds.UI.Callbacks.adData, TeamFinder.handleError
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
				
				TeamFinder.Utils.delay.call(this, function () {
					ListAds.Elements.divAdContainer.accordion({
						active: false,
						autoHeight: false,
						collapsible: true,
						event: 'click',
						header: 'h3',
						heightStyle: 'content'
					});
				}, 'obj => !TeamFinder.Utils.notNullOrUndefinedFunction(obj.accordion)', ListAds.Elements.divAdContainer, 1);
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
			adContentName.html('Name: ' + (TeamFinder.Utils.notNullOrEmpty(data.User.FirstName) || TeamFinder.Utils.notNullOrEmpty(data.User.LastName) ? data.User.FirstName + ' ' + data.User.LastName : '[Unspecified]'));
			adContent.append(adContentName);
			
			var adContentEmail = $(document.createElement('div')),
				adContentEmailAnchor = $(document.createElement('a'));
			adContentEmail.html('Email: ');
			adContentEmailAnchor.html((TeamFinder.Utils.notNullOrEmpty(data.User.Email) ? data.User.Email : '[Unspecified]'));
			adContentEmailAnchor.attr('href', 'mailto:' + (TeamFinder.Utils.notNullOrEmpty(data.User.Email) ? data.User.Email : '[Unspecified]'));
			adContentEmail.append(adContentEmailAnchor);
			adContent.append(adContentEmail);
			
			var adContentAge = $(document.createElement('div'));
			adContentAge.html('Age: ' + (TeamFinder.Utils.notNullOrEmpty(data.User.Age) ? data.User.Age : '[Unspecified]'));
			adContent.append(adContentAge);
			
			var adContentGender = $(document.createElement('div'));
			adContentGender.html('Gender: ' + (TeamFinder.Utils.notNullOrEmpty(data.User.Gender) ? data.User.Gender : '[Unspecified]'));
			adContent.append(adContentGender);
			
			var adContentLookingFor = $(document.createElement('div'));
			adContentLookingFor.html('Looking for: ' + (TeamFinder.Utils.notNullOrEmpty(data.LookingFor.Name) ? data.LookingFor.Name : '[Unspecified]'));
			adContent.append(adContentLookingFor);
			
			var adContentDescription = $(document.createElement('div'));
			adContentDescription.html('Description: ' + (TeamFinder.Utils.notNullOrEmpty(data.Description) ? data.Description : '[No description]'));
			adContent.append(adContentDescription);
			
			return adContentWrapper;
		};
			
		UI.createHeadline = function (data) {
			var headline = $(document.createElement('h3'));
			headline.html(TeamFinder.Utils.notNullOrEmpty(data.Headline) ? data.Headline : '[No subject]');
			headline.addClass('adHeadline');
			
			var headlineInfo = $(document.createElement('span'));
			headlineInfo.html((TeamFinder.Utils.notNullOrEmpty(data.Sport.Name) ? data.Sport.Name : '[unspecified sport]')+ ' - ' +
								(TeamFinder.Utils.notNullOrEmpty(data.Location.Name) ? data.Location.Name : '[Unspecified location]'));
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
				TeamFinder.callServer('../data/getAdData.php', {
						loc: ListAds.adFilter.loc,
						lf: ListAds.adFilter.lf,
						s: ListAds.adFilter.s,
						q: 'count'
					}, 'GET', 'json', UI.Callbacks.adCount, TeamFinder.handleError
				);
				setTimeout(UI.paginate, 500);
			}
		};
		
		return UI;
	}(ListAds.UI || {}));
	
	ListAds.applyFilter = function () {
		ListAds.adFilter = {
			loc: TeamFinder.Utils.getSelectedDropDownValue(ListAds.Elements.selectLocation),
			lf: TeamFinder.Utils.getSelectedDropDownValue(ListAds.Elements.selectLookingFor),
			s: TeamFinder.Utils.getSelectedDropDownValue(ListAds.Elements.selectSport),
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
		TeamFinder.loadStyle('../lib/jquery.paginate.styles.css', null);
		TeamFinder.loadStyle('../css/ListAds.css', null);
	};
	
	ListAds.initialize = function () {
		TeamFinder.loadScript('../lib/jquery.paginate.js', function () {
			//Set initial values
			ListAds.pageSize = 5;
			ListAds.Elements.initialize();
			
			ListAds.adFilter = {
				loc: TeamFinder.Utils.sanitizeFilter('locations', TeamFinder.Utils.getQueryStringParameter('loc')),
				lf: TeamFinder.Utils.sanitizeFilter('lookingFor', TeamFinder.Utils.getQueryStringParameter('lf')),
				s: TeamFinder.Utils.sanitizeFilter('sports', TeamFinder.Utils.getQueryStringParameter('s'))
			};
			
			//Create UI elements
			if (!isNaN(parseInt(TeamFinder.Utils.getQueryStringParameter('i'), 10))) {
				ListAds.adCount = 1;
				//Call and get specific ad
			}
			else {
				ListAds.UI.paginate(1);
				ListAds.Events.onPageChanged();
			}
			
			ListAds.Elements.selectLocation = TeamFinder.UI.createDropDown(ListAds.Elements.selectLocation, '../data/getAdFilterData.php', {
					q: 'locations',
					defaultText: '--Location--',
					selected: ListAds.adFilter.loc
				}
			);
			ListAds.Elements.selectLookingFor = TeamFinder.UI.createDropDown(ListAds.Elements.selectLookingFor, '../data/getAdFilterData.php', {
					q: 'lookingFor',
					defaultText: '--Looking For--',
					selected: ListAds.adFilter.lf
				}
			);
			ListAds.Elements.selectSport = TeamFinder.UI.createDropDown(ListAds.Elements.selectSport,'../data/getAdFilterData.php', {
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
				ListAds.adFilter.loc = TeamFinder.Utils.getSelectedDropDownValue($(this));
			});
			
			ListAds.Elements.selectLookingFor.on('change', function () {
				ListAds.adFilter.lf = TeamFinder.Utils.getSelectedDropDownValue($(this));
			});
			
			ListAds.Elements.selectSport.on('change', function () {
				ListAds.adFilter.s = TeamFinder.Utils.getSelectedDropDownValue($(this));
			});
		});
	};
	
	ListAds.loadDependencies();
	
	return ListAds;
}(window.TeamFinder.ListAds || {}));

TeamFinder.selectedMenuItem = 'menuListAds';
TeamFinder.ready(TeamFinder.ListAds.initialize);