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
	
	ListAds.Callbacks = (function (Callbacks) {
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
			if (ListAds.pageData instanceof Array) {
				$.each(ListAds.pageData, function (index) {
					ListAds.Elements.divAdContainer.append(ListAds.UI.createHeadline(this));
					ListAds.Elements.divAdContainer.append(ListAds.UI.createAdContent(this));
				});
			}
			else {
				ListAds.Elements.divAdContainer.append(ListAds.UI.createHeadline(ListAds.pageData));
				ListAds.Elements.divAdContainer.append(ListAds.UI.createAdContent(ListAds.pageData));
			}
			
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
		
		Callbacks.adDeleted = function (data) {
			if (true === data.deleted) {
				ListAds.Events.onAdDeleted();
				return;
			}
			
			alert('Your ad couldn\'t be deleted at this time. Please reload the page and try again');
		};
		
		return Callbacks;
	}(ListAds.Callbacks || {}));
	
	ListAds.Elements = (function (Elements) {
		Elements.adButtons = null;
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
			
			Elements.adButtons = $('.adButton');
		};
		
		return Elements;
	}(ListAds.Elements || {}));
	
	ListAds.Events = (function (Events) {
		Events.onAdDeleted = function () {
			ListAds.adFilter = {
				loc: TeamFinder.Utils.getSelectedDropDownValue(ListAds.Elements.selectLocation),
				lf: TeamFinder.Utils.getSelectedDropDownValue(ListAds.Elements.selectLookingFor),
				s: TeamFinder.Utils.getSelectedDropDownValue(ListAds.Elements.selectSport),
			}
			ListAds.adCount = null;
			ListAds.UI.paginate(ListAds.pageIndex);
			ListAds.Events.onPageChanged();
		};
		
		Events.onPageChanged = function (page) {
			ListAds.pageIndex = page || ListAds.pageIndex;
			
			TeamFinder.callServer('../data/getAdData.php', {
					loc: ListAds.adFilter.loc,
					lf: ListAds.adFilter.lf,
					s: ListAds.adFilter.s,
					pageIndex: ListAds.pageIndex - 1,
					pageSize: ListAds.pageSize,
					q: 'data'
				}, 'GET', 'json', ListAds.Callbacks.adData, TeamFinder.handleError
			);
		};
		
		return Events;
	}(ListAds.Events || {}));
	
	ListAds.UI = (function(UI) {
		UI.initializedState = {
			selectLocation: false,
			selectLookingFor: false,
			selectSport: false
		};
		
		UI.createAdContent = function (data) {
			var adContentWrapper = $(document.createElement('div'));
			adContentWrapper.addClass('adContentWrapper');
			
			var _buttons = {
				deleteButton: {
					label: 'Delete',
					onClick: function () {
						if (confirm(TeamFinder.Utils.stringFormat('Are you sure you want to delete the ad with headline: {0}', $(this).data('teamFinder-headline')))) {
							ListAds.deleteAd($(this).data('teamFinder-id'), TeamFinder.loggedInUser.sessionId());
						}
					}
				},
				editButton: {
					label: 'Edit',
					onClick: function () {
						$(window.location).attr('href', '../createAd.html?i=' + $(this).data('teamFinder-id'));
					}
				}
			};
			
			for (var key in _buttons) {
				var button = $(document.createElement('div')),
					buttonAnchor = $(document.createElement('a'));
				button.addClass('adButton');
				buttonAnchor.html(_buttons[key].label);
				button.data('teamFinder-id', data.Id);
				button.data('teamFinder-userId', data.User.Id);
				button.data('teamFinder-headline', data.Headline);
				button.append(buttonAnchor);
				button.on('click', _buttons[key].onClick);
				
				if (!TeamFinder.isLoggedIn() || TeamFinder.loggedInUser.id() !== data.User.Id) {
					button.hide();
				}
				
				adContentWrapper.append(button);
			}
			
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
			adContentEmailAnchor.attr('href', TeamFinder.Utils.stringFormat('mailto:{0}&subject={1}&body={2}{3}',
				(TeamFinder.Utils.notNullOrEmpty(data.User.Email) ? data.User.Email : '[Unspecified]'),
				encodeURIComponent('RE: ' + data.Headline + ' - http://teamfinder.se'),
				'%0D%0A%0D%0A%0D%0A--------------------------------------------------------------------------------%0D%0A%0D%0A',
				encodeURIComponent(data.Description))
			);
			adContentEmail.append(adContentEmailAnchor);
			adContent.append(adContentEmail);
			
			var adContentAge = $(document.createElement('div'));
			adContentAge.html('Age: ' + (TeamFinder.Utils.notNullOrEmpty(data.User.BirthDate) ? TeamFinder.Utils.getAge(data.User.BirthDate) : '[Unspecified]'));
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
		
		UI.isInitialized = function () {
			for (var key in UI.initializedState) {
				if (!UI.initializedState[key]) {
					return false;
				}
			}
			
			return true;
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
					}, 'GET', 'json', ListAds.Callbacks.adCount, TeamFinder.handleError
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
	
	ListAds.deleteAd = function (id, sessionId) {
		TeamFinder.callServer('../data/deleteAd.php', {
				i: id,
				sessionId: sessionId
			}, 'POST', 'json', ListAds.Callbacks.adDeleted, TeamFinder.handleError
		);
	};
	
	ListAds.hasFilter = function () {
		return (ListAds.adFilter.loc != null || ListAds.adFilter.lf != null || ListAds.adFilter.s != null);
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
				TeamFinder.callServer('../data/getAdData.php', {
						i: TeamFinder.Utils.getQueryStringParameter('i'),
						q: 'specific'
					}, 'GET', 'json', ListAds.Callbacks.adData, TeamFinder.handleError
				);
				
				ListAds.UI.paginate(1);
				
				//Trigger click on ad when ready
				TeamFinder.Utils.delay.call(this, function () {
					$(ListAds.Elements.divAdContainer.children()[0]).trigger('click');
				}, 'obj => 1 > obj.children().length', ListAds.Elements.divAdContainer, 1);
			}
			else {
				ListAds.UI.paginate(1);
				ListAds.Events.onPageChanged();
			}
			
			ListAds.Elements.selectLocation = TeamFinder.UI.createDropDown(ListAds.Elements.selectLocation, '../data/getAdFilterData.php', {
					q: 'locations',
					defaultText: '--Location--',
					selected: ListAds.adFilter.loc,
					eventHandlers: {
						create: function (event, object) {
							ListAds.UI.initializedState.selectLocation = true;
							
							if (ListAds.UI.isInitialized()) {
								ListAds.Elements.divFilter.slideUp();
							}
						}
					}
				}
			);
			ListAds.Elements.selectLookingFor = TeamFinder.UI.createDropDown(ListAds.Elements.selectLookingFor, '../data/getAdFilterData.php', {
					q: 'lookingFor',
					defaultText: '--Looking For--',
					selected: ListAds.adFilter.lf,
					eventHandlers: {
						create: function (event, object) {
							ListAds.UI.initializedState.selectLookingFor = true;
							
							if (ListAds.UI.isInitialized()) {
								ListAds.Elements.divFilter.slideUp();
							}
						}
					}
				}
			);
			ListAds.Elements.selectSport = TeamFinder.UI.createDropDown(ListAds.Elements.selectSport, '../data/getAdFilterData.php', {
					q: 'sports',
					defaultText: '--Sport--',
					selected: ListAds.adFilter.s,
					eventHandlers: {
						create: function (event, object) {
							ListAds.UI.initializedState.selectSport = true;
							
							if (ListAds.UI.isInitialized()) {
								ListAds.Elements.divFilter.slideUp();
							}
						}
					}
				}
			);
			
			//Subscribe to events
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
			
			TeamFinder.Events.on('logIn', function (user) {
				ListAds.Elements.initialize();
				ListAds.Elements.adButtons.each(function () {
					if (TeamFinder.loggedInUser.id() === $(this).data('teamFinder-userId'))
					{
						$(this).show();
					}
				});
			}).on('logOut', function (user) {
				ListAds.Elements.initialize();
				ListAds.Elements.adButtons.each(function () {
					$(this).hide();
				});
			});
		});
	};
	
	ListAds.loadDependencies = function () {
		TeamFinder.loadStyle('../lib/jquery.paginate.styles.css', null);
		TeamFinder.loadStyle('../css/listAds.css', null);
	};
	
	ListAds.loadDependencies();
	
	return ListAds;
}(window.TeamFinder.ListAds || {}));

TeamFinder.selectedMenuItem = 'menuListAds';
TeamFinder.ready(TeamFinder.ListAds.initialize);