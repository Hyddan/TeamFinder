window.TeamFinder.Tips = (function (Tips) {
	Tips.UI = (function (UI) {
		UI.createNavigation = function (data) {
			$('#divNavigationPlaceHolder').html(data);
			
			TeamFinder.Utils.delay.call(this, function () {
				$('.navigateRMenu').navigateR();
				$('.navigateRSubMenu').navigateR();
				
				$('.navigateR-item').each(function () {
					$(this).children(':first').on('click', function () {
						$(this).parent().children('.navigateRSubMenu').slideToggle();
					});
				});
			}, 'obj => !TeamFinder.Utils.notNullOrUndefinedFunction(obj.navigateR)', $('.navigateRMenu'), 1);
		};
		
		return UI;
	}(Tips.UI || {}));
	
	Tips.initialize = function () {
		TeamFinder.callServer('../data/tipsNavigation.html', '', 'GET', 'html', Tips.UI.createNavigation, TeamFinder.handleError);
	};
	
	Tips.loadDependencies = function () {
		TeamFinder.loadStyle('../css/jquery.navigateR.css', null);
		
		TeamFinder.loadScript('../js/jquery.navigateR.js', null);
	};
	
	Tips.loadDependencies();
	
	return Tips;
}(window.TeamFinder.Tips || {}));

TeamFinder.selectedMenuItem = 'menuTips';
TeamFinder.ready(TeamFinder.Tips.initialize);