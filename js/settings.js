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
		
		return Callbacks;
	}(Settings.Callbacks || {}));
	
	Settings.Elements = (function (Elements) {
		Elements.aLogIn = null;
		Elements.divNotLoggedInContainer = null;
		Elements.divPasswordChangeButton = null;
		Elements.divSettingsContainer = null;
		Elements.divSuccess = null;
		
		Elements.initialize = function () {
			for (var key in this) {
				if ('function' !== typeof this[key]) {
					this[key] = $('#' + key);
				}
			}
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
		}
		
		//Subscribe to events
		Settings.Elements.aLogIn.on('click', function (e) {
			TeamFinder.Authentication.Elements.divAuthenticationButton.trigger('click');
			e.preventDefault();
			e.stopPropagation();
		});
		
		Settings.Elements.divPasswordChangeButton.on('click', function () {
			alert('ToDo: add change password functionality!');
		});
		
		TeamFinder.Events.on('logIn', function (user) {
			Settings.Elements.divNotLoggedInContainer.hide();
			Settings.Elements.divSettingsContainer.fadeIn();
		}).on('logOut', function (user) {
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