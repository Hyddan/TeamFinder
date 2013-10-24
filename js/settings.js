window.TeamFinder.Settings = (function (Settings) {
	Settings.Callbacks = (function (Callbacks) {
		Callbacks.passwordChange = function (data) {
			if (TeamFinder.Utils.notNullOrEmpty(data) && TeamFinder.Utils.notNullOrEmpty(data.Error)) {
				Settings.Elements.divPasswordChangeValidationMessage.text(data.Error.Message);
				Settings.Elements.divPasswordChangeValidationMessage.show();
			}
			else {
				Settings.Elements.divPasswordChangeFormContainer.fadeOut();
				Settings.Elements.divPasswordChangeSuccess.slideDown();
				
				Settings.Elements.formPasswordChange[0].reset();
				Settings.Elements.divPasswordChangeValidationMessage.text('');
				Settings.Elements.divPasswordChangeValidationMessage.hide();
				
				setTimeout(function () {
					Settings.Elements.divPasswordChangeSuccess.slideUp();
				}, 2000);
			}
		};
		
		Callbacks.update = function (data) {
			if (TeamFinder.Utils.notNullOrEmpty(data) && TeamFinder.Utils.notNullOrEmpty(data.Error)) {
				Settings.Elements.divSettingsValidationMessage.text(data.Error.Message);
				Settings.Elements.divSettingsValidationMessage.show();
			}
			else {
				Settings.Elements.divSuccess.show();
				Settings.Elements.divSettingsContainer.hide();
				
				setTimeout(function () {
					$(window.location).attr('href', '../settings.html');
				}, 2000);
			}
		};
		
		Callbacks.user = function (data) {
			if (TeamFinder.Utils.notNullOrEmpty(data.PictureUrl)) {
				Settings.Elements.imgProfilePicture.attr('src', data.PictureUrl);
				Settings.Elements.imgProfilePicture.show();
			}
			
			TeamFinder.Utils.delay.call(this, function () {
				Settings.Elements.selectGender.data("selectBox-selectBoxIt").selectOption(TeamFinder.Utils.getFilterValue('genders', TeamFinder.Utils.notNullOrEmpty(data.Gender) ? data.Gender : '-'));
			}, 'obj => !TeamFinder.Utils.notNullOrEmpty(obj.data("selectBox-selectBoxIt"))', Settings.Elements.selectGender, 1);
			
			Settings.Elements.txtBirthDate.datepicker('setDate', TeamFinder.Utils.notNullOrEmpty(data.BirthDate) ? data.BirthDate : new Date()),
			Settings.Elements.txtDescription.val(TeamFinder.Utils.notNullOrEmpty(data.Description) ? data.Description : '[Description]');
			Settings.Elements.txtEmail.val(TeamFinder.Utils.notNullOrEmpty(data.Email) ? data.Email : '[Email]');
			Settings.Elements.txtFirstName.val(TeamFinder.Utils.notNullOrEmpty(data.FirstName) ? data.FirstName : '[FirstName]');
			Settings.Elements.txtLastName.val(TeamFinder.Utils.notNullOrEmpty(data.LastName) ? data.LastName : '[LastName]');
			Settings.Elements.txtUserName.val(TeamFinder.Utils.notNullOrEmpty(data.UserName) ? data.UserName : '[UserName]');
		};
		
		return Callbacks;
	}(Settings.Callbacks || {}));
	
	Settings.Elements = (function (Elements) {
		Elements.aLogIn = null;
		Elements.aPicture = null;
		Elements.divNotLoggedInContainer = null;
		Elements.divPasswordChangeButton = null;
		Elements.divPasswordChangeCancelButton = null;
		Elements.divPasswordChangeFormContainer = null;
		Elements.divPasswordChangeSubmitButton = null;
		Elements.divPasswordChangeSuccess = null;
		Elements.divPasswordChangeValidationMessage = null;
		Elements.divSettingsContainer = null;
		Elements.divSettingsValidationMessage = null;
		Elements.divSubmitButton = null;
		Elements.divSuccess = null;
		Elements.formPasswordChange = null;
		Elements.formSettings = null;
		Elements.imgProfilePicture = null;
		Elements.selectGender = null;
		Elements.txtConfirmPassword = null;
		Elements.txtCurrentPassword = null;
		Elements.txtBirthDate = null;
		Elements.txtDescription = null;
		Elements.txtEmail = null;
		Elements.txtFirstName = null;
		Elements.txtLastName = null;
		Elements.txtNewPassword = null;
		Elements.txtSelectGender = null;
		Elements.txtUserName = null;
		
		Elements.initialize = function () {
			for (var key in this) {
				if ('function' !== typeof this[key]) {
					this[key] = $('#' + key);
				}
			}
		};
		
		return Elements;
	}(Settings.Elements || {}));
	
	Settings.UI = (function (UI) {
		UI.initDatePicker = function () {
			Settings.Elements.txtBirthDate.datepicker({
				buttonImage: '../images/btn_calendar.gif',
				changeMonth: true,
				changeYear: true,
				dateFormat: 'yy-mm-dd',
				showOn: 'both'
			});
		};
		
		UI.initGenderSelect = function () {
			TeamFinder.UI.createDropDown(Settings.Elements.selectGender, '', {q: 'genders', defaultText: '--Gender--', selected: null});
		};
		
		UI.initialize = function () {
			Settings.UI.initDatePicker();
			Settings.UI.initUploader();
			Settings.UI.initGenderSelect();
		};
		
		UI.initUploader = function () {
			var _plUploader = new plupload.Uploader({
				browse_button: 'aPicture',
				chunk_size: '1mb',
				container : 'divUploaderContainer',
				filters: [
					{title : 'Image files', extensions : 'jpg,gif,png'}
				],
				flash_swf_url: '../lib/plupload/plupload.flash.swf',
				max_file_size: '5mb',
				multi_selection: false,
				resize: {
					height: 240,
					width: 320,
					quality: 90
				},
				runtimes: 'gears,html5,flash,silverlight,browserplus',
				silverlight_xap_url: '../lib/plupload/plupload.silverlight.xap',
				unique_names: true,
				url: '../handlers/plUploaderHandler.php'
			});
			
			//Syntax "fix"
			plupload.Uploader.prototype.on = _plUploader.bind;
			
			_plUploader.on('BeforeUpload', function (uploader) { });

			_plUploader.on('Error', function(uploader, error) {
				TeamFinder.handleError(error);
			});

			_plUploader.on('QueueChanged', function(uploader, files) {
				if (1 === uploader.files.length) {
					uploader.start();
				}
			});

			_plUploader.on('FileUploaded', function (uploader, file) {
				uploader.removeFile(file);
				Settings.Elements.imgProfilePicture.fadeOut(function () {
					Settings.Elements.imgProfilePicture.attr('src', '../images/users/' + file.target_name);
					Settings.Elements.imgProfilePicture.fadeIn();
					Settings.Elements.aPicture.hide();
				});
			});

			_plUploader.init();
			
			window.uploader = _plUploader;
		};
		
		return UI;
	}(Settings.UI || {}));
	
	Settings.initialize = function () {
		//Set initial values
		Settings.Elements.initialize();
		Settings.Elements.divSuccess.hide();
		Settings.Elements.divSettingsContainer.hide();
		Settings.Elements.divSettingsValidationMessage.hide();
		Settings.Elements.divPasswordChangeSuccess.hide();
		Settings.Elements.divPasswordChangeValidationMessage.hide();
		Settings.Elements.divNotLoggedInContainer.show();
		Settings.Elements.imgProfilePicture.hide();
		Settings.Elements.divPasswordChangeFormContainer.hide();
		
		TeamFinder.Utils.delay.call(this, function () {
			TeamFinder.Utils.delay.call(this, function () {
				if (TeamFinder.isLoggedIn()) {
					Settings.Elements.divNotLoggedInContainer.hide();
					Settings.Elements.divSettingsContainer.show();
					
					//Create UI elements
					Settings.UI.initialize();
					
					TeamFinder.callServer('../data/getUser.php', {
							sessionId: TeamFinder.loggedInUser.sessionId()
						}, 'GET', 'json', Settings.Callbacks.user, TeamFinder.handleError
					);
				}
			}, 'obj => !TeamFinder.Utils.notNullOrEmpty(obj.plupload) && !TeamFinder.Utils.notNullOrUndefinedFunction(obj.plupload)', window, 1);
		}, 'obj => !TeamFinder.Utils.notNullOrUndefinedFunction(obj.datepicker)', Settings.Elements.txtBirthDate, 1);
			
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
						txtBirthDate: {
							date: true,
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
						txtSelectGender: {
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
						
						Settings.Elements.divSettingsValidationMessage.text('');
						Settings.Elements.divSettingsValidationMessage.hide();
						
						TeamFinder.callServer('../data/updateUser.php', {
							birthDate: Settings.Elements.txtBirthDate.val(),
							description: Settings.Elements.txtDescription.val(),
							email: Settings.Elements.txtEmail.val(),
							firstName: Settings.Elements.txtFirstName.val(),
							gender: Settings.Elements.txtSelectGender.val(),
							lastName: Settings.Elements.txtLastName.val(),
							pictureFileName: (TeamFinder.Utils.notNullOrEmpty(Settings.Elements.imgProfilePicture.attr('src')) ?
									Settings.Elements.imgProfilePicture.attr('src') :
									null),
							sessionId: user.SessionId,
							userName: Settings.Elements.txtUserName.val()
						}, 'POST', 'json', Settings.Callbacks.update, TeamFinder.handleError);
					}
				});
				
				TeamFinder.Settings.Elements.formPasswordChange.validate({
					ignore: [],
					rules: {
						txtConfirmPassword: {
							equalTo: '#txtNewPassword'
						},
						txtCurrentPassword: {
							minlength: 8,
							required: true
						},
						txtNewPassword: {
							minlength: 8,
							required: true
						}
					},
					messages: {
						txtConfirmPassword: {
							equalTo: 'Passwords do not match'
						}
					},
					submitHandler: function () {
						var user = JSON.parse(TeamFinder.Utils.getCookie('tfUser'));
						if (null == user || !TeamFinder.Utils.notNullOrEmpty(user.Id) || !TeamFinder.Utils.notNullOrEmpty(user.SessionId)) {
							alert('You need to be logged in change password.');
							return false;
						}
						
						Settings.Elements.divPasswordChangeValidationMessage.text('');
						Settings.Elements.divPasswordChangeValidationMessage.hide();
						
						TeamFinder.callServer('../data/authentication.php', {
							ajaxAction: 'changePassword',
							currentPassword: Base64.encode(Settings.Elements.txtCurrentPassword.val()),
							newPassword: Base64.encode(Settings.Elements.txtNewPassword.val()),
							sessionId: user.SessionId
						}, 'POST', 'json', Settings.Callbacks.passwordChange, TeamFinder.handleError);
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
			Settings.Elements.divPasswordChangeFormContainer.fadeIn();
		});
		
		Settings.Elements.divPasswordChangeCancelButton.on('click', function () {
			Settings.Elements.divPasswordChangeFormContainer.fadeOut();
			
			Settings.Elements.formPasswordChange[0].reset();
			Settings.Elements.divPasswordChangeValidationMessage.text('');
			Settings.Elements.divPasswordChangeValidationMessage.hide();
		});
		
		Settings.Elements.divPasswordChangeSubmitButton.on('click', function () {
			Settings.Elements.formPasswordChange.submit();
		});
		
		Settings.Elements.divSubmitButton.on('click', function () {
			Settings.Elements.formSettings.submit();
		});
			
		Settings.Elements.selectGender.on('change', function () {
			Settings.Elements.txtSelectGender.val(TeamFinder.Utils.getSelectedDropDownValue(Settings.Elements.selectGender));
			Settings.Elements.txtSelectGender.valid();
		});
		
		TeamFinder.Events.on('logIn', function (user) {
			Settings.Elements.divSuccess.hide();
			Settings.Elements.divNotLoggedInContainer.hide();
			Settings.Elements.divSettingsContainer.fadeIn();
			
			//Create UI elements
			Settings.UI.initialize();
			
			TeamFinder.callServer('../data/getUser.php', {
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
		
		TeamFinder.loadScript('../lib/plupload/plupload.full.js', null);
	};
	
	Settings.loadDependencies();
	
	return Settings;
}(window.TeamFinder.Settings || {}));

TeamFinder.selectedMenuItem = 'menuSettings';
TeamFinder.ready(TeamFinder.Settings.initialize);