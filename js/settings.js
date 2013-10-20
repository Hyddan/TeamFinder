window.TeamFinder.Settings = (function (Settings) {
	Settings.Callbacks = (function (Callbacks) {
		Callbacks.passwordChange = function (data) {
			if (TeamFinder.Utils.notNullOrEmpty(data.success) && true === data.success) {
				//Password changed
			}
		};
		
		Callbacks.passwordForm = function (data) {
			//Present Change Password Form
		};
		
		Callbacks.update = function (data) {
			Settings.Elements.divSuccess.show();
			Settings.Elements.divSettingsContainer.hide();
			
			setTimeout(function () {
				$(window.location).attr('href', '../settings.html');
			}, 5000);
		};
		
		Callbacks.user = function (data) {
			var _pictureUrlParts = TeamFinder.Utils.notNullOrEmpty(data.PictureUrl) ? data.PictureUrl.split('/') : null,
				_rdoGender = TeamFinder.Utils.notNullOrEmpty(data.Gender) ? $('input[name="rdoGender"][value="' + data.Gender + '"]') : null;
			
			if (null != _rdoGender) {
				_rdoGender.trigger('click');
			}
			
			Settings.Elements.txtAge.val(TeamFinder.Utils.notNullOrEmpty(data.Age) ? data.Age : '[Age]'),
			Settings.Elements.txtDescription.val(TeamFinder.Utils.notNullOrEmpty(data.Description) ? data.Description : '[Description]');
			Settings.Elements.txtEmail.val(TeamFinder.Utils.notNullOrEmpty(data.Email) ? data.Email : '[Email]');
			Settings.Elements.txtFirstName.val(TeamFinder.Utils.notNullOrEmpty(data.FirstName) ? data.FirstName : '[FirstName]');
			Settings.Elements.txtLastName.val(TeamFinder.Utils.notNullOrEmpty(data.LastName) ? data.LastName : '[LastName]');
			Settings.Elements.divPictureNamePlaceholder.text(null != _pictureUrlParts ? _pictureUrlParts[_pictureUrlParts - 1] : '(No file)');
			Settings.Elements.txtUserName.val(TeamFinder.Utils.notNullOrEmpty(data.UserName) ? data.UserName : '[UserName]');
		};
		
		return Callbacks;
	}(Settings.Callbacks || {}));
	
	Settings.Elements = (function (Elements) {
		Elements.aLogIn = null;
		Elements.divNotLoggedInContainer = null;
		Elements.divPasswordChangeButton = null;
		Elements.divPictureNamePlaceholder = null;
		Elements.divSettingsContainer = null;
		Elements.divSuccess = null;
		Elements.formSettings = null;
		Elements.rdoGender = null;
		Elements.txtAge = null;
		Elements.txtDescription = null;
		Elements.txtEmail = null;
		Elements.txtFirstName = null;
		Elements.txtLastName = null;
		Elements.txtUserName = null;
		
		Elements.initialize = function () {
			for (var key in this) {
				if ('function' !== typeof this[key]) {
					this[key] = $('#' + key);
				}
			}
			
			Elements.rdoGender = $('input[name="rdoGender"]');
		};
		
		return Elements;
	}(Settings.Elements || {}));
	
	Settings.initialize = function () {
		//Set initial values
		Settings.Elements.initialize();
		Settings.Elements.divSuccess.hide();
		Settings.Elements.divSettingsContainer.hide();
		Settings.Elements.divNotLoggedInContainer.show();
		
		if (TeamFinder.isLoggedIn()) {
			Settings.Elements.divNotLoggedInContainer.hide();
			Settings.Elements.divSettingsContainer.show();
		
			TeamFinder.callServer('../data/getuser.php', {
					sessionId: TeamFinder.loggedInUser.sessionId()
				}, 'GET', 'json', Settings.Callbacks.user, TeamFinder.handleError
			);
		}
		
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
				TeamFinder.Settings.Elements.formSettings.validate({
					ignore: [],
					rules: {
						rdoGender: {
							required: true
						},
						txtAge: {
							min: 10,
							required: true
						},
						txtDescription: {
							required: true
						},
						txtEmail: {
							email: true,
							required: true
						},
						txtFirstName: {
							required: true
						},
						txtLastName: {
							required: true
						},
						txtUserName: {
							required: true
						}
					},
					submitHandler: function () {
						var user = JSON.parse(TeamFinder.Utils.getCookie('tfUser'));
						if (null == user || !TeamFinder.Utils.notNullOrEmpty(user.Id) || !TeamFinder.Utils.notNullOrEmpty(user.SessionId)) {
							alert('You need to be logged in update user information.');
							return false;
						}
						
						TeamFinder.callServer('../data/updateUser.php', {
							age: Settings.Elements.txtAge.val(),
							description: Settings.Elements.txtDescription.val(),
							email: Settings.Elements.txtEmail.val(),
							firstName: Settings.Elements.txtFirstName.val(),
							gender: Settings.Elements.rdoGender.val(),
							lastName: Settings.Elements.txtLastName.val(),
							pictureFileName: ((TeamFinder.Utils.notNullOrEmpty(Settings.Elements.divPictureNamePlaceholder.text())
								&& '(No file)' !== Settings.Elements.divPictureNamePlaceholder.text()) ?
									Settings.Elements.divPictureNamePlaceholder.text() :
									null),
							sessionId: user.SessionId,
							userName: Settings.Elements.txtUserName.val()
						}, 'POST', 'json', Settings.Callbacks.update, TeamFinder.handleError);
					}
				});
			})();
		});
		
		//Subscribe to events
		Settings.Elements.aLogIn.on('click', function (e) {
			TeamFinder.Authentication.Elements.divAuthenticationButton.trigger('click');
			e.preventDefault();
			e.stopPropagation();
		});
		
		Settings.Elements.divPasswordChangeButton.on('click', function () {
			alert('ToDo: add change password functionality!');
		});
			
		Settings.Elements.rdoGender.on('click', function () {
			Settings.Elements.rdoGender = $('input[name="rdoGender"]:checked');
		});
		
		TeamFinder.Events.on('logIn', function (user) {
			Settings.Elements.divSuccess.hide();
			Settings.Elements.divNotLoggedInContainer.hide();
			Settings.Elements.divSettingsContainer.fadeIn();
			
			TeamFinder.callServer('../data/getuser.php', {
					sessionId: TeamFinder.loggedInUser.sessionId()
				}, 'GET', 'json', Settings.Callbacks.user, TeamFinder.handleError
			);
		}).on('logOut', function (user) {
			Settings.Elements.divSuccess.hide();
			Settings.Elements.divSettingsContainer.hide();
			Settings.Elements.divNotLoggedInContainer.fadeIn();
		}).on('menuInitialized', function (user) {
			Settings.Elements.initialize();
		});
	};
	
	Settings.loadDependencies = function () {
		TeamFinder.loadStyle('../css/settings.css', null);
	};
	
	Settings.loadDependencies();
	
	return Settings;
}(window.TeamFinder.Settings || {}));

TeamFinder.selectedMenuItem = 'menuSettings';
TeamFinder.ready(TeamFinder.Settings.initialize);