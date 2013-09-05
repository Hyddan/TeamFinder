window.Zapto.Authentication = (function (Authentication) {
	Authentication.UI = (function (UI) {
		UI.insertAuthenticationFormOnPage = function(data) {
			Authentication.Elements.divAuthenticationPlaceHolder.html(data);
			Authentication.Elements.divAuthenticationPlaceHolder.hide();
			
			Authentication.Elements.initialize();
			
			//Hook up events
			Authentication.Elements.formAuthenticate.on('submit', function () {
				Zapto.logIn(Base64.encode(Authentication.Elements.txtUsername.val()), Base64.encode(Authentication.Elements.txtPassword.val()));
					Zapto.Authentication.Elements.divAuthenticationPlaceHolder.slideUp();
					Authentication.Elements.txtPassword.val('');
			});
			
			Zapto.Authentication.Elements.divAuthenticationButton.on('click', function (e) {
				if (Zapto.isLoggedIn()) {
					Zapto.logOut();
					return;
				}
				
				Zapto.Authentication.Elements.divAuthenticationPlaceHolder.slideToggle();
				Zapto.Authentication.Elements.txtUsername.focus();
				e.stopPropagation();
			});
			
			Zapto.Authentication.Elements.divSubmitAuthenticationButton.on('click', function (e) {
				Zapto.Authentication.Elements.formAuthenticate.trigger('submit');
			});
			
			Zapto.Authentication.Elements.divSignUpButton.on('click', function (e) {
				alert('SignUp is not available at this time');
				
				Zapto.createUser(26, 'SomeDescription', 'danielhedenius@hotmail.com', 'Male', 'Daniel Hedenius', Base64.encode('SomePasswordFromForm'), 'SomePictureUrl');
			});
			
			$(document).on('click', function (e) {
				if (Zapto.Authentication.Elements.formAuthenticate.is(':visible') && !Zapto.Authentication.Elements.divAuthenticationPlaceHolder.is(e.target) && 0 === Zapto.Authentication.Elements.divAuthenticationPlaceHolder.has(e.target).length) {
					Zapto.Authentication.Elements.divAuthenticationPlaceHolder.slideUp();
				}
			});
			
			$(document).on('keyup', function (e) {
				if (0 < Zapto.Authentication.Elements.divAuthenticationContainer.has($(document.activeElement)).length) {
					if (27 === e.keyCode) {
						Zapto.Authentication.Elements.divAuthenticationPlaceHolder.slideUp();
					}
					else if (13 === e.keyCode) {
						Zapto.Authentication.Elements.formAuthenticate.trigger('submit');
					}
				}
			});
		};	
		
		return UI;
	}(Authentication.UI || {}));
	
	Authentication.initialize = function () {
		Zapto.Utils.delay.call(this, function () {
			Authentication.Elements.initialize();
			
			Zapto.callServer('../data/authentication.html', '', 'GET', 'html', Authentication.UI.insertAuthenticationFormOnPage, Zapto.handleError);
			
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
		Elements.divCredentialsMessage = null;
		Elements.divSubmitAuthenticationButton = null;
		Elements.divSignUpButton = null;
		Elements.formAuthenticate = null;
		Elements.txtPassword = null;
		Elements.txtUsername = null;
		
		Elements.initialize = function () {
			Elements.aAuthenticationButton = $('#aAuthenticationButton');
			Elements.divAuthenticationButton = $('#divAuthenticationButton');
			Elements.divAuthenticationContainer = $('#divAuthenticationContainer');
			Elements.divAuthenticationPlaceHolder = $('#divAuthenticationPlaceHolder');
			Elements.divCredentialsMessage = $('#divCredentialsMessage');
			Elements.divSubmitAuthenticationButton = $('#divSubmitAuthenticationButton');
			Elements.divSignUpButton = $('#divSignUpButton');
			Elements.formAuthenticate = $('#formAuthenticate');
			Elements.txtPassword = $('#txtPassword');
			Elements.txtUsername = $('#txtUsername');
		};
		
		return Elements;
	}(Authentication.Elements || {}));
	
	return Authentication;
}(window.Zapto.Authentication || {}));

Zapto.ready(Zapto.Authentication.initialize);