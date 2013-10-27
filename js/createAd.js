window.TeamFinder.CreateAd = (function (CreateAd) {
	CreateAd.editMode = false;
	
	CreateAd.Callbacks = (function (Callbacks) {
		Callbacks.createAd = function (data) {
			CreateAd.Elements.divSuccess.show();
			CreateAd.Elements.divCreateAdFormContainer.hide();
			
			setTimeout(function () {
				$(window.location).attr('href', '../createAd.html');
			}, 2000);
		};
		
		Callbacks.adData = function (data) {
			CreateAd.editMode = TeamFinder.isLoggedIn()
									&& TeamFinder.Utils.notNullOrEmpty(data)
									&& TeamFinder.Utils.notNullOrEmpty(data.User)
									&& TeamFinder.Utils.notNullOrEmpty(data.User.Id)
									&& TeamFinder.loggedInUser.id() === data.User.Id;
			
			if (CreateAd.editMode) {
				CreateAd.Elements.h1AdFormHeadline.html('Edit ad');
				CreateAd.Elements.txtAdId.val(data.Id);
				CreateAd.Elements.txtHeadline.val(data.Headline);
				CreateAd.Elements.txtDescription.val(data.Description);
				
				TeamFinder.Utils.delay.call(this, function () {
					CreateAd.Elements.selectLocation.data("selectBox-selectBoxIt").selectOption(TeamFinder.Utils.getFilterValue('locations', data.Location.Name));
				}, 'obj => !TeamFinder.Utils.notNullOrEmpty(obj.data("selectBox-selectBoxIt"))', CreateAd.Elements.selectLocation, 1);
				
				TeamFinder.Utils.delay.call(this, function () {
					CreateAd.Elements.selectLookingFor.data("selectBox-selectBoxIt").selectOption(TeamFinder.Utils.getFilterValue('lookingFor', data.LookingFor.Name));
				}, 'obj => !TeamFinder.Utils.notNullOrEmpty(obj.data("selectBox-selectBoxIt"))', CreateAd.Elements.selectLookingFor, 1);
				
				TeamFinder.Utils.delay.call(this, function () {
					CreateAd.Elements.selectSport.data("selectBox-selectBoxIt").selectOption(TeamFinder.Utils.getFilterValue('sports', data.Sport.Name));
				}, 'obj => !TeamFinder.Utils.notNullOrEmpty(obj.data("selectBox-selectBoxIt"))', CreateAd.Elements.selectSport, 1);
			}
		};
		
		return Callbacks;
	}(CreateAd.Callbacks || {}));
	
	CreateAd.Elements = (function (Elements) {
		Elements.aLogIn = null;
		Elements.divCreateAdFormContainer = null;
		Elements.divNotLoggedInContainer = null;
		Elements.divResult = null;
		Elements.divSubmitButton = null;
		Elements.divSuccess = null;
		Elements.h1AdFormHeadline = null;
		Elements.formCreateAd = null;
		Elements.selectLocation = null;
		Elements.selectLookingFor = null;
		Elements.selectSport = null;
		Elements.txtAdId = null;
		Elements.txtDescription = null;
		Elements.txtHeadline = null;
		Elements.txtSelectSport = null;
		Elements.txtSelectLocation = null;
		Elements.txtSelectLookingFor = null;
		
		Elements.initialize = function() {
			for (var key in this) {
				if ('function' !== typeof this[key]) {
					this[key] = $('#' + key);
				}
			}
		};
		
		return Elements;
	}(CreateAd.Elements || {}));
	
	CreateAd.initialize = function () {
		//Set initial values
		CreateAd.Elements.initialize();
		CreateAd.Elements.divResult.hide();
		CreateAd.Elements.divSuccess.hide();
		CreateAd.Elements.divCreateAdFormContainer.hide();
		CreateAd.Elements.divNotLoggedInContainer.show();
		
		if (TeamFinder.isLoggedIn()) {
			CreateAd.Elements.divNotLoggedInContainer.hide();
			CreateAd.Elements.divCreateAdFormContainer.show();
			
			//Create UI elements
			TeamFinder.UI.createDropDown(CreateAd.Elements.selectSport, '../data/getAdFilterData.php', {q: 'sports', defaultText: '--Sport--', selected: null});
			TeamFinder.UI.createDropDown(CreateAd.Elements.selectLocation, '../data/getAdFilterData.php', {q: 'locations', defaultText: '--Location--', selected: null});
			TeamFinder.UI.createDropDown(CreateAd.Elements.selectLookingFor, '../data/getAdFilterData.php', {q: 'lookingFor', defaultText: '--Looking For--', selected: null});
		}
		
		//Create UI elements
		CreateAd.Elements.h1AdFormHeadline.html('Create an ad');
		CreateAd.Elements.txtHeadline.focus();
		
		if (!isNaN(parseInt(TeamFinder.Utils.getQueryStringParameter('i'), 10))) {
			//Call and get specific ad
			TeamFinder.callServer('../data/getAdData.php', {
					i: TeamFinder.Utils.getQueryStringParameter('i'),
					q: 'specific'
				}, 'GET', 'json', CreateAd.Callbacks.adData, TeamFinder.handleError
			);
		}
		
		//Subscribe to events
		CreateAd.Elements.divSubmitButton.on('click', function () {
			CreateAd.Elements.formCreateAd.submit();
		});
		
		CreateAd.Elements.selectSport.on('change', function () {
			CreateAd.Elements.txtSelectSport.val(TeamFinder.Utils.getSelectedDropDownValue(CreateAd.Elements.selectSport));
			CreateAd.Elements.txtSelectSport.valid();
		});
		
		CreateAd.Elements.selectLocation.on('change', function () {
			CreateAd.Elements.txtSelectLocation.val(TeamFinder.Utils.getSelectedDropDownValue(CreateAd.Elements.selectLocation));
			CreateAd.Elements.txtSelectLocation.valid();
		});
		
		CreateAd.Elements.selectLookingFor.on('change', function () {
			CreateAd.Elements.txtSelectLookingFor.val(TeamFinder.Utils.getSelectedDropDownValue(CreateAd.Elements.selectLookingFor));
			CreateAd.Elements.txtSelectLookingFor.valid();
		});
		
		CreateAd.Elements.aLogIn.on('click', function (e) {
			TeamFinder.Authentication.Elements.divAuthenticationButton.trigger('click');
			e.preventDefault();
			e.stopPropagation();
		});
		
		TeamFinder.Events.on('logIn', function (user) {
			CreateAd.Elements.divNotLoggedInContainer.hide();
			CreateAd.Elements.divCreateAdFormContainer.fadeIn();
			
			//Create UI elements
			TeamFinder.UI.createDropDown(CreateAd.Elements.selectSport, '../data/getAdFilterData.php', {q: 'sports', defaultText: '--Sport--', selected: null});
			TeamFinder.UI.createDropDown(CreateAd.Elements.selectLocation, '../data/getAdFilterData.php', {q: 'locations', defaultText: '--Location--', selected: null});
			TeamFinder.UI.createDropDown(CreateAd.Elements.selectLookingFor, '../data/getAdFilterData.php', {q: 'lookingFor', defaultText: '--Looking For--', selected: null});
		}).on('logOut', function (user) {
			CreateAd.Elements.divCreateAdFormContainer.hide();
			CreateAd.Elements.divNotLoggedInContainer.fadeIn();
		});
		
		TeamFinder.loadScript('../lib/jquery.validate-1.11.1.min.js', function () {
			//Fix issues in jQuery Validation plugin
			$.validator.prototype.elements = function () {
				var validator = this,
					rulesCache = {};
				// select all valid inputs inside the form (no submit or reset buttons)
				// workaround $Query([]).add until http://dev.jquery.com/ticket/2114 is solved
				return $([]).add(this.currentForm.elements)
					.filter(':input')
					.not(':submit, :reset, :image, [disabled]')
					.not(this.settings.ignore)
					.filter(function () {
						var elementIdentification = this.id || this.name;

						if (!elementIdentification && validator.settings.debug && window.console) {
							console.error("%o has no id nor name assigned", this);
						}
						
						if (elementIdentification in rulesCache || !validator.objectLength($(this).rules())) {
							return false;
						}

						return rulesCache[elementIdentification] = true;
					});
			};
			
			$.validator.prototype.checkForm = function () {
				this.prepareForm();
				var count = 0,
					elements = null,
					i = 0;
					
				for (elements = (this.currentElements = this.elements()); elements[i]; i++) {
					if (this.findByName(elements[i].name).length != undefined && this.findByName(elements[i].name).length > 1) {
						for (count; count < this.findByName(elements[i].name).length; count++) {
							this.check(this.findByName(elements[i].name)[count]);
						}
					}
					else {
						this.check(elements[i]);
					}
				}
				return this.valid();
			};
			
			(function () { //Hook up validation
				TeamFinder.CreateAd.Elements.formCreateAd.validate({
					ignore: [],
					rules: {
						txtDescription: {
							required: true
						},
						txtHeadline: {
							required: true
						},
						txtSelectSport: {
							required: true
						},
						txtSelectLocation: {
							required: true
						},
						txtSelectLookingFor: {
							required: true
						}
					},
					submitHandler: function () {
						var user = JSON.parse(TeamFinder.Utils.getCookie('tfUser'));
						if (null == user || !TeamFinder.Utils.notNullOrEmpty(user.Id) || !TeamFinder.Utils.notNullOrEmpty(user.SessionId)) {
							alert('You need to be logged in to create an ad.');
							return false;
						}
						
						if (CreateAd.editMode) {
							TeamFinder.callServer('../data/updateAd.php', {
								id: CreateAd.Elements.txtAdId.val(),
								description: CreateAd.Elements.txtDescription.val(),
								headline: CreateAd.Elements.txtHeadline.val(),
								location: TeamFinder.Utils.getSelectedDropDownValue(CreateAd.Elements.selectLocation),
								lookingFor: TeamFinder.Utils.getSelectedDropDownValue(CreateAd.Elements.selectLookingFor),
								sport: TeamFinder.Utils.getSelectedDropDownValue(CreateAd.Elements.selectSport),
								sessionId: user.SessionId
							}, 'POST', 'json', CreateAd.Callbacks.createAd, TeamFinder.handleError);
							
							return;
						}
						
						TeamFinder.callServer('../data/createAd.php', {
							description: CreateAd.Elements.txtDescription.val(),
							headline: CreateAd.Elements.txtHeadline.val(),
							location: TeamFinder.Utils.getSelectedDropDownValue(CreateAd.Elements.selectLocation),
							lookingFor: TeamFinder.Utils.getSelectedDropDownValue(CreateAd.Elements.selectLookingFor),
							sport: TeamFinder.Utils.getSelectedDropDownValue(CreateAd.Elements.selectSport),
							userId: user.Id
						}, 'POST', 'json', CreateAd.Callbacks.createAd, TeamFinder.handleError);
					}
				});
			})();
		});
	};
	
	CreateAd.loadDependencies = function () {
		TeamFinder.loadStyle('../css/createAd.css', null);
	};
	
	CreateAd.loadDependencies();
	
	return CreateAd;
}(window.TeamFinder.CreateAd || {}));

TeamFinder.selectedMenuItem = 'menuCreate';
TeamFinder.ready(TeamFinder.CreateAd.initialize);