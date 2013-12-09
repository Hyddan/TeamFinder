window.TeamFinder.Tips = (function (Tips) {
	Tips.Callbacks = (function (Callbacks) {
		Callbacks.navigation = function (data) {
			$('#divNavigationPlaceHolder').html(data);
			
			TeamFinder.Utils.delay.call(this, function () {
				$('.navigateRMenu').navigateR();
				$('.navigateRSubMenu').navigateR();
				
				$('.navigateR-item').each(function () {
					$(this).children(':first').on('click', function () {
						$(this).parent().children('.navigateRSubMenu').slideToggle();
					});
				});
				
				$('.tipsContent').each(function () {
					$(this).on('click', function () {
						$('.dataContainer').each(function () {
							$(this).hide();
						});
						
						$('#' + $(this).data('envido-container')).fadeIn();
					});
				});
			}, 'obj => !TeamFinder.Utils.notNullOrUndefinedFunction(obj.navigateR)', $('.navigateRMenu'), 1);
		};
		
		return Callbacks;
	}(Tips.Callbacks || {}));
	
	Tips.Elements = (function (Elements) {
		Elements.divFloorballRulesContainer = null;
		Elements.divSoccerRulesContainer = null;
		
		Elements.initialize = function () {
			for (var key in this) {
				if ('function' !== typeof this[key]) {
					this[key] = $('#' + key);
				}
			}
			
			Elements.dataContainers = $('.dataContainer');
		};
		
		return Elements;
	}(Tips.Elements || {}));
	
	Tips.initialize = function () {
		Tips.Elements.initialize();
		
		TeamFinder.callServer('../data/tipsNavigation.html', '', 'GET', 'html', Tips.Callbacks.navigation, TeamFinder.handleError);
		
		Tips.Elements.dataContainers.hide();
	};
	
	Tips.loadDependencies = function () {
		TeamFinder.loadStyle('../css/jquery.navigateR.css', null);
		TeamFinder.loadStyle('../css/tips.css', null);
		
		TeamFinder.loadScript('../js/jquery.navigateR.js', null);
	};
	
	Tips.loadDependencies();
	
	return Tips;
}(window.TeamFinder.Tips || {}));

TeamFinder.selectedMenuItem = 'menuTips';
TeamFinder.ready(TeamFinder.Tips.initialize);