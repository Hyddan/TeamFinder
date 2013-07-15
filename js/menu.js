window.Zapto.Menu = (function(Menu) {
	Menu.UI = (function(UI) {
		UI.insertMenuOnPage = function(data) {
			$('#menuPlaceHolder').html(data);
			if(Zapto.Utils.notNullOrEmpty(Zapto.selectedMenuItem)) {
				$('#' + Zapto.selectedMenuItem).addClass('current_list_item');
			}
		};	
		
		return UI;
	}(Menu.UI || {}));
	
	Menu.initialize = function() {
		Zapto.callServer('menu.html', '', 'GET', 'html', Menu.UI.insertMenuOnPage, Zapto.handleError);
	};
	
	return Menu;
}(window.Zapto.Menu || {}));

Zapto.ready(Zapto.Menu.initialize);