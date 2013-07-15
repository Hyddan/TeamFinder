window.Zapto.Tips = (function(Tips) {
	Tips.UI = (function(UI) {
		UI.createNavigation = function(data) {
			$('#navigationPlaceHolder').html(data);
			
			$('.navigateRMenu').navigateR();
			$('.navigateRSubMenu').navigateR();
			
			$('.navigateR-item').each(function() {
				$(this).children(':first').on('click', function() {
					$(this).parent().children('.navigateRSubMenu').slideToggle();
				});
			});
		};
		
		return UI;
	}(Tips.UI || {}));
	
	Tips.loadDependencies = function() {
		Zapto.loadStyle('css/jquery.navigateR.css', null);
		
		Zapto.loadScript('js/jquery.navigateR.js', null);
	};
	
	Tips.initialize = function() {
		Zapto.callServer('tipsNavigation.html', '', 'GET', 'html', Tips.UI.createNavigation, Zapto.handleError);
	};
	
	Tips.loadDependencies();
	
	return Tips;
}(window.Zapto.Tips || {}));

Zapto.selectedMenuItem = 'menuTips';
Zapto.ready(Zapto.Tips.initialize);