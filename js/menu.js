window.TeamFinder.Menu = (function (Menu) {
	Menu.Callbacks = (function (Callbacks) {
		Callbacks.menu = function (data) {
			$('#divMenuPlaceHolder').html(data);
			if(TeamFinder.Utils.notNullOrEmpty(TeamFinder.selectedMenuItem)) {
				$('#' + TeamFinder.selectedMenuItem).addClass('menuSelectedItem');
			}
			
			Menu.Elements.initialize();
			Menu.updateVisibility();
			
			TeamFinder.Events.fire('menuInitialized');
		};	
		
		return Callbacks;
	}(Menu.Callbacks || {}));
	
	Menu.Elements = (function (Elements) {
		Elements.menuSettings = null;
		
		Elements.initialize = function () {
			for (var key in this) {
				if ('function' !== typeof this[key]) {
					this[key] = $('#' + key);
				}
			}
		};
		
		return Elements;
	}(Menu.Elements || {}));
	
	Menu.initialize = function () {
		TeamFinder.callServer('../data/menu.html', '', 'GET', 'html', Menu.Callbacks.menu, TeamFinder.handleError);
		
		//Subscribe to events
		TeamFinder.Events.on('logIn', function (user) {
			Menu.updateVisibility();
		}).on('logOut', function (user) {
			Menu.updateVisibility();
		});
	};
	
	Menu.updateVisibility = function () {
		var _display = 'none';
		
		if (TeamFinder.isLoggedIn()) {
			_display = 'block';
		}
		
		Menu.Elements.menuSettings.css('display', _display);
	};
	
	return Menu;
}(window.TeamFinder.Menu || {}));

TeamFinder.ready(TeamFinder.Menu.initialize);