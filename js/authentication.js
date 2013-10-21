window.TeamFinder.Authentication = (function (Authentication) {
	var _activeForm = null;
	
	Authentication.Callbacks = (function (Callbacks) {
		Callbacks.authentication = function(data) {
			Authentication.Elements.divAuthenticationPlaceHolder.html(data);
			Authentication.Elements.divAuthenticationPlaceHolder.hide();
			Authentication.Elements.divSignUpPlaceHolder.hide();
			
			Authentication.Elements.initialize();
			
			//Subscribe to events
			TeamFinder.Authentication.Elements.divAuthenticationButton.on('click', function (e) {
				if (TeamFinder.isLoggedIn()) {
					TeamFinder.logOut();
					return;
				}
				
				if (Authentication.Elements.formSignUp.is(':visible')) {
					Authentication.Elements.divSignUpPlaceHolder.slideUp();
				}
				else {
					Authentication.Elements.divAuthenticationPlaceHolder.slideToggle();
					Authentication.Elements.txtAuthenticateUsername.focus();
					e.stopPropagation();
				}
			});
			
			Authentication.Elements.divAuthenticateSubmitAuthenticationButton.on('click', function (e) {
				Authentication.Elements.formAuthenticate.trigger('submit');
			});
			
			Authentication.Elements.divAuthenticateSignUpButton.on('click', function (e) {
				TeamFinder.callServer('../data/signUp.html', '', 'GET', 'html', Authentication.Callbacks.signUp, TeamFinder.handleError);
			});
			
			$(document).on('click', function (e) {
				if ((Authentication.Elements.formAuthenticate.is(':visible') || Authentication.Elements.formSignUp.is(':visible'))
						&& (!Authentication.UI.isClicked(Authentication.Elements.divAuthenticationPlaceHolder, e.target)
							&& !Authentication.UI.isClicked(Authentication.Elements.divSignUpPlaceHolder, e.target))) {
					Authentication.Elements.divAuthenticationPlaceHolder.slideUp();
					Authentication.Elements.divSignUpPlaceHolder.slideUp();
				}
			});
			
			$(document).on('keyup', function (e) {
				if (Authentication.UI.isActive(Authentication.Elements.divAuthenticationContainer)) {
					if (27 === e.keyCode) { //ESC
						Authentication.Elements.divAuthenticationPlaceHolder.slideUp();
						Authentication.Elements.divSignUpPlaceHolder.slideUp();
					}
					else if (13 === e.keyCode) { //Enter
						if (Authentication.Elements.formAuthenticate.is(':visible')) {
							Authentication.Elements.divAuthenticateSubmitAuthenticationButton.trigger('click');
						}
						else if (Authentication.Elements.formSignUp.is(':visible')) {
							Authentication.Elements.divSignUpSignUpButton.trigger('click');
						}
					}
				}
			});
			
			(function () { //Hook up validation
				Authentication.Elements.formAuthenticate.validate({
					rules: {
						txtAuthenticateUsername: {
							required: true
						},
						txtAuthenticatePassword: {
							required: true
						}
					},
					submitHandler: function () {
						TeamFinder.logIn(Base64.encode(Authentication.Elements.txtAuthenticateUsername.val()), Base64.encode(Authentication.Elements.txtAuthenticatePassword.val()));
						Authentication.Elements.divAuthenticationPlaceHolder.slideUp();
						Authentication.Elements.txtAuthenticatePassword.val('');
					}
				});
			})();
		};
		
		Callbacks.signUp = function(data) {
			Authentication.Elements.divSignUpPlaceHolder.html(data);
			Authentication.Elements.divSignUpPlaceHolder.hide();
			
			Authentication.Elements.initialize();
			
			Authentication.Elements.divAuthenticationPlaceHolder.fadeOut('slow');
			Authentication.Elements.divSignUpPlaceHolder.fadeIn('slow');
			
			Authentication.Elements.txtSignUpFirstName.focus();
			
			//Subscribe to events
			Authentication.Elements.divSignUpSignUpButton.on('click', function () {
				Authentication.Elements.formSignUp.trigger('submit');
			});
			
			Authentication.Elements.rdoSignUpGender.on('click', function () {
				Authentication.Elements.rdoSignUpGender = $('input[name="rdoSignUpGender"]:checked');
			});
			
			(function () { //Hook up validation
				Authentication.Elements.formSignUp.validate({
					rules: {
						rdoSignUpGender: {
							required: true
						},
						txtSignUpAge: {
							min: 10,
							required: true
						},
						txtSignUpDescription: {
							required: true
						},
						txtSignUpEmail: {
							email: true,
							required: true
						},
						txtSignUpFirstName: {
							required: true
						},
						txtSignUpLastName: {
							required: true
						},
						txtSignUpPassword: {
							minlength: 8,
							required: true
						}
					},
					submitHandler: function () {
						TeamFinder.createUser(Authentication.Elements.txtSignUpAge.val(),
											Authentication.Elements.txtSignUpDescription.val(),
											Authentication.Elements.txtSignUpEmail.val(),
											Authentication.Elements.txtSignUpFirstName.val(),
											Authentication.Elements.rdoSignUpGender.val(),
											Authentication.Elements.txtSignUpLastName.val(),
											Base64.encode(Authentication.Elements.txtSignUpPassword.val()),
											((TeamFinder.Utils.notNullOrEmpty(Authentication.Elements.divSignUpPictureNamePlaceholder.text())
												&& '(No file)' !== Authentication.Elements.divSignUpPictureNamePlaceholder.text()) ?
													Authentication.Elements.divSignUpPictureNamePlaceholder.text() :
													null)
						);
						Authentication.Elements.divSignUpPlaceHolder.slideUp();
						Authentication.Elements.txtSignUpPassword.val('');
					}
				});
			})();
			
			Authentication.UI.initUploader();
		};
		
		return Callbacks;
	}(Authentication.Callbacks || {}));
	
	Authentication.Elements = (function (Elements) {
		Elements.aAuthenticationButton = null;
		Elements.divAuthenticationButton = null;
		Elements.divAuthenticationContainer = null;
		Elements.divAuthenticationPlaceHolder = null;
		Elements.divAuthenticateValidationMessage = null;
		Elements.divAuthenticateSubmitAuthenticationButton = null;
		Elements.divAuthenticateSignUpButton = null;
		Elements.divSignUpPictureNamePlaceholder = null;
		Elements.divSignUpPlaceHolder = null;
		Elements.divSignUpSignUpButton = null;
		Elements.divSignUpValidationMessage = null;
		Elements.formAuthenticate = null;
		Elements.formSignUp = null;
		Elements.rdoSignUpGender = null;
		Elements.txtAuthenticatePassword = null;
		Elements.txtAuthenticateUsername = null;
		Elements.txtSignUpAge = null;
		Elements.txtSignUpDescription = null;
		Elements.txtSignUpEmail = null;
		Elements.txtSignUpFirstName = null;
		Elements.txtSignUpLastName = null;
		Elements.txtSignUpPassword = null;
		
		Elements.initialize = function () {
			for (var key in this) {
				if ('function' !== typeof this[key]) {
					this[key] = $('#' + key);
				}
			}
			
			Elements.rdoSignUpGender = $('input[name="rdoSignUpGender"]');
		};
		
		return Elements;
	}(Authentication.Elements || {}));
	
	Authentication.UI = (function (UI) {
		UI.initUploader = function () {
			var _plUploader = new plupload.Uploader({
				browse_button: 'aSignUpPicture',
				chunk_size: '1mb',
				container : 'divSignUpUploaderContainer',
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
				Authentication.Elements.divSignUpPictureNamePlaceholder.fadeOut(function () {
					Authentication.Elements.divSignUpPictureNamePlaceholder.text(file.target_name);
					Authentication.Elements.divSignUpPictureNamePlaceholder.fadeIn();
				});
			});

			_plUploader.init();
			
			window.uploader = _plUploader;
		};
		
		UI.isActive = function (jqElement) {
			return 0 < jqElement.has($(document.activeElement)).length;
		};
		
		UI.isClicked = function (jqElement, target) {
			return jqElement.is(target) || 0 < jqElement.has(target).length;
		};
		
		return UI;
	}(Authentication.UI || {}));
	
	Authentication.initialize = function () {
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
			
			TeamFinder.Utils.delay.call(this, function () {
				Authentication.Elements.initialize();
				
				TeamFinder.callServer('../data/authentication.html', '', 'GET', 'html', Authentication.Callbacks.authentication, TeamFinder.handleError);
				
				Authentication.updateButtonLabel();
			}, 'obj => false === TeamFinder.Utils.notNullOrEmpty($(\'#menuAuthentication\')[0])', null, 1);
			
			//Subscribe to events
			TeamFinder.Events.on('logIn', function (user) {
				Authentication.updateButtonLabel();
				Authentication.Elements.formAuthenticate[0].reset();
				Authentication.Elements.divAuthenticateValidationMessage.text('');
				Authentication.Elements.divAuthenticateValidationMessage.hide();
			}).on('logInFailed', function () {
				TeamFinder.Authentication.Elements.divAuthenticationPlaceHolder.slideDown();
				TeamFinder.Authentication.Elements.divAuthenticateValidationMessage.text('Invalid credentials');
				TeamFinder.Authentication.Elements.divAuthenticateValidationMessage.show();
			}).on('logOut', function (user) {
				Authentication.updateButtonLabel();
			}).on('signUp', function (user) {
				Authentication.Elements.formSignUp[0].reset();
				Authentication.Elements.divSignUpPlaceHolder.slideUp();
				Authentication.Elements.divSignUpValidationMessage.text('');
				Authentication.Elements.divSignUpValidationMessage.hide();
			}).on('signUpFailed', function (error) {
				Authentication.Elements.divSignUpPlaceHolder.slideDown();
				Authentication.Elements.divSignUpValidationMessage.text(error.Message);
				Authentication.Elements.divSignUpValidationMessage.show();
			});
		});
	};
	
	Authentication.loadDependencies = function () {
		TeamFinder.loadScript('../lib/plupload/plupload.full.js', null);
	};
	
	Authentication.updateButtonLabel = function () {
		var _label = 'Log in';
		
		if (TeamFinder.isLoggedIn()) {
			_label = 'Log out';
		}
		
		Authentication.Elements.aAuthenticationButton.text(_label);
	};
	
	Authentication.loadDependencies();
	
	return Authentication;
}(window.TeamFinder.Authentication || {}));

TeamFinder.ready(TeamFinder.Authentication.initialize);