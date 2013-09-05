window.Zapto.Authentication = (function (Authentication) {
	var _activeForm = null;
	
	Authentication.UI = (function (UI) {
		UI.Callbacks = (function (Callbacks) {
			Callbacks.authentication = function(data) {
				Authentication.Elements.divAuthenticationPlaceHolder.html(data);
				Authentication.Elements.divAuthenticationPlaceHolder.hide();
				Authentication.Elements.divSignUpPlaceHolder.hide();
				
				Authentication.Elements.initialize();
				
				//Hook up events
				Authentication.Elements.formAuthenticate.on('submit', function () {
					Zapto.logIn(Base64.encode(Authentication.Elements.txtAuthenticateUsername.val()), Base64.encode(Authentication.Elements.txtAuthenticatePassword.val()));
					Zapto.Authentication.Elements.divAuthenticationPlaceHolder.slideUp();
					Authentication.Elements.txtAuthenticatePassword.val('');
				});
				
				Zapto.Authentication.Elements.divAuthenticationButton.on('click', function (e) {
					if (Zapto.isLoggedIn()) {
						Zapto.logOut();
						return;
					}
					
					if (Zapto.Authentication.Elements.formSignUp.is(':visible')) {
						Zapto.Authentication.Elements.divSignUpPlaceHolder.slideUp();
					}
					else {
						Zapto.Authentication.Elements.divAuthenticationPlaceHolder.slideToggle();
						Zapto.Authentication.Elements.txtAuthenticateUsername.focus();
						e.stopPropagation();
					}
				});
				
				Zapto.Authentication.Elements.divAuthenticateSubmitAuthenticationButton.on('click', function (e) {
					Zapto.Authentication.Elements.formAuthenticate.trigger('submit');
				});
				
				Zapto.Authentication.Elements.divAuthenticateSignUpButton.on('click', function (e) {
					Zapto.callServer('../data/signUp.html', '', 'GET', 'html', UI.Callbacks.signUp, Zapto.handleError);
				});
				
				$(document).on('click', function (e) {
					if ((Zapto.Authentication.Elements.formAuthenticate.is(':visible') || Zapto.Authentication.Elements.formSignUp.is(':visible'))
							&& (!UI.isClicked(Zapto.Authentication.Elements.divAuthenticationPlaceHolder, e.target)
								&& !UI.isClicked(Zapto.Authentication.Elements.divSignUpPlaceHolder, e.target))) {
						Zapto.Authentication.Elements.divAuthenticationPlaceHolder.slideUp();
						Zapto.Authentication.Elements.divSignUpPlaceHolder.slideUp();
					}
				});
				
				$(document).on('keyup', function (e) {
					if (UI.isActive(Zapto.Authentication.Elements.divAuthenticationContainer)) {
						if (27 === e.keyCode) { //ESC
							Zapto.Authentication.Elements.divAuthenticationPlaceHolder.slideUp();
							Zapto.Authentication.Elements.divSignUpPlaceHolder.slideUp();
						}
						else if (13 === e.keyCode) { //Enter
							if (Zapto.Authentication.Elements.formAuthenticate.is(':visible')) {
								Zapto.Authentication.Elements.divAuthenticateSubmitAuthenticationButton.trigger('click');
							}
							else if (Zapto.Authentication.Elements.formSignUp.is(':visible')) {
								Zapto.Authentication.Elements.divSignUpSignUpButton.trigger('click');
							}
						}
					}
				});
			};
			
			Callbacks.signUp = function(data) {
				Authentication.Elements.divSignUpPlaceHolder.html(data);
				Authentication.Elements.divSignUpPlaceHolder.hide();
				
				Authentication.Elements.initialize();
				
				Zapto.Authentication.Elements.divAuthenticationPlaceHolder.fadeOut('slow');
				Zapto.Authentication.Elements.divSignUpPlaceHolder.fadeIn('slow');
				
				Zapto.Authentication.Elements.txtSignUpAge.focus();
				
				//Hook up events
				Authentication.Elements.formSignUp.on('submit', function () {
					// ToDo: Validate fields (using jquery validate?)
					Zapto.createUser(Authentication.Elements.txtSignUpAge.val(),
										Authentication.Elements.txtSignUpDescription.val(),
										Authentication.Elements.txtSignUpEmail.val(),
										Authentication.Elements.txtSignUpGender.val(),
										Authentication.Elements.txtSignUpName.val(),
										Base64.encode(Authentication.Elements.txtSignUpPassword.val()),
										Authentication.Elements.txtSignUpPictureUrl.val());
					Zapto.Authentication.Elements.divSignUpPlaceHolder.slideUp();
					Authentication.Elements.txtSignUpPassword.val('');
					
					Zapto.Authentication.Elements.divSignUpPlaceHolder.slideUp();
				});
				
				Authentication.Elements.divSignUpSignUpButton.on('click', function () {
					Zapto.Authentication.Elements.formSignUp.trigger('submit');
				});
			};
			
			return Callbacks;
		}(UI.Callbacks || {}));
		
		UI.isActive = function (jqElement) {
			return 0 < jqElement.has($(document.activeElement)).length;
		};
		
		UI.isClicked = function (jqElement, target) {
			return jqElement.is(target) || 0 < jqElement.has(target).length;
		};
		
		return UI;
	}(Authentication.UI || {}));
	
	Authentication.initialize = function () {
		Zapto.Utils.delay.call(this, function () {
			Authentication.Elements.initialize();
			
			Zapto.callServer('../data/authentication.html', '', 'GET', 'html', Authentication.UI.Callbacks.authentication, Zapto.handleError);
			
			Authentication.updateButtonLabel();
		}, 'obj => false === Zapto.Utils.notNullOrEmpty($(\'#menuAuthentication\')[0])', null, 1);
	};
	
	Authentication.updateButtonLabel = function () {
		var _label = 'Log in';
		
		if (Zapto.isLoggedIn()) {
			_label = 'Log out';
		}
		
		Authentication.Elements.aAuthenticationButton.text(_label);
	}
	
	Authentication.Elements = (function (Elements) {
		Elements.aAuthenticationButton = null;
		Elements.divAuthenticationButton = null;
		Elements.divAuthenticationContainer = null;
		Elements.divAuthenticationPlaceHolder = null;
		Elements.divAuthenticateValidationMessage = null;
		Elements.divAuthenticateSubmitAuthenticationButton = null;
		Elements.divAuthenticateSignUpButton = null;
		Elements.divSignUpPlaceHolder = null;
		Elements.divSignUpValidationMessage = null;
		Elements.divSignUpSignUpButton = null;
		Elements.formAuthenticate = null;
		Elements.formSignUp = null;
		Elements.txtAuthenticatePassword = null;
		Elements.txtAuthenticateUsername = null;
		Elements.txtSignUpAge = null;
		Elements.txtSignUpDescription = null;
		Elements.txtSignUpEmail = null;
		Elements.txtSignUpGender = null;
		Elements.txtSignUpName = null;
		Elements.txtSignUpPassword = null;
		Elements.txtSignUpPictureUrl = null;
		
		Elements.initialize = function () {
			Elements.aAuthenticationButton = $('#aAuthenticationButton');
			Elements.divAuthenticationButton = $('#divAuthenticationButton');
			Elements.divAuthenticationContainer = $('#divAuthenticationContainer');
			Elements.divAuthenticationPlaceHolder = $('#divAuthenticationPlaceHolder');
			Elements.divAuthenticateValidationMessage = $('#divAuthenticateValidationMessage');
			Elements.divAuthenticateSubmitAuthenticationButton = $('#divAuthenticateSubmitAuthenticationButton');
			Elements.divAuthenticateSignUpButton = $('#divAuthenticateSignUpButton');
			Elements.divSignUpPlaceHolder = $('#divSignUpPlaceHolder');
			Elements.divSignUpValidationMessage = $('#divSignUpValidationMessage');
			Elements.divSignUpSignUpButton = $('#divSignUpSignUpButton');
			Elements.formAuthenticate = $('#formAuthenticate');
			Elements.formSignUp = $('#formSignUp');
			Elements.txtAuthenticatePassword = $('#txtAuthenticatePassword');
			Elements.txtAuthenticateUsername = $('#txtAuthenticateUsername');
			Elements.txtSignUpAge = $('#txtSignUpAge');
			Elements.txtSignUpDescription = $('#txtSignUpDescription');
			Elements.txtSignUpEmail = $('#txtSignUpEmail');
			Elements.txtSignUpGender = $('#txtSignUpGender');
			Elements.txtSignUpName = $('#txtSignUpName');
			Elements.txtSignUpPassword = $('#txtSignUpPassword');
			Elements.txtSignUpPictureUrl = $('#txtSignUpPictureUrl');
		};
		
		return Elements;
	}(Authentication.Elements || {}));
	
	return Authentication;
}(window.Zapto.Authentication || {}));

Zapto.ready(Zapto.Authentication.initialize);