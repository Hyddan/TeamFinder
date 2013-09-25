window.TeamFinder.Menu = (function (Menu) {
	Menu.UI = (function (UI) {
		UI.insertMenuOnPage = function (data) {
			$('#divMenuPlaceHolder').html(data);
			if(TeamFinder.Utils.notNullOrEmpty(TeamFinder.selectedMenuItem)) {
				$('#' + TeamFinder.selectedMenuItem).addClass('menuSelectedItem');
			}
		};	
		
		return UI;
	}(Menu.UI || {}));
	
	Menu.initialize = function () {
		TeamFinder.callServer('../data/menu.html', '', 'GET', 'html', Menu.UI.insertMenuOnPage, TeamFinder.handleError);
	};
	
	return Menu;
}(window.TeamFinder.Menu || {}));

TeamFinder.ready(TeamFinder.Menu.initialize);