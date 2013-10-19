window.TeamFinder.Settings = (function (Settings) {
	Settings.Elements = (function (Elements) {
		Elements.aLogIn = null;
		Elements.divNotLoggedInContainer = null;
		Elements.divSettingsContainer = null;
		Elements.menuSettings = null;
		
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
		
		TeamFinder.Events.on('logIn', function (user) {
			Settings.updateMenuItemVisibility();
			
			Settings.Elements.divNotLoggedInContainer.hide();
			Settings.Elements.divSettingsContainer.fadeIn();
		}).on('logOut', function (user) {
			Settings.updateMenuItemVisibility();
			
			Settings.Elements.divSettingsContainer.hide();
			Settings.Elements.divNotLoggedInContainer.fadeIn();
		}).on('menuInitialized', function (user) {
			Settings.Elements.initialize();
		});
	};
	
	Settings.loadDependencies = function () {
		TeamFinder.loadStyle('../css/settings.css', null);
	};
	
	Settings.updateMenuItemVisibility = function () {
		var _display = 'none';
		
		if (TeamFinder.isLoggedIn()) {
			_display = 'block';
		}
		
		Settings.Elements.menuSettings.css('display', _display);
	};
	
	Settings.loadDependencies();
	
	return Settings;
}(window.TeamFinder.Settings || {}));

TeamFinder.selectedMenuItem = 'menuSettings';
TeamFinder.ready(TeamFinder.Settings.initialize);