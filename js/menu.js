window.TeamFinder.Menu = (function (Menu) {
	Menu.Callbacks = (function (Callbacks) {
		Callbacks.menu = function (data) {
			$('#divMenuPlaceHolder').html(data);
			if(TeamFinder.Utils.notNullOrEmpty(TeamFinder.selectedMenuItem)) {
				$('#' + TeamFinder.selectedMenuItem).addClass('menuSelectedItem');
			}
			
			TeamFinder.Events.fire('menuInitialized');
		};	
		
		return Callbacks;
	}(Menu.Callbacks || {}));
	
	Menu.initialize = function () {
		TeamFinder.callServer('../data/menu.html', '', 'GET', 'html', Menu.Callbacks.menu, TeamFinder.handleError);
	};
	
	return Menu;
}(window.TeamFinder.Menu || {}));

TeamFinder.ready(TeamFinder.Menu.initialize);