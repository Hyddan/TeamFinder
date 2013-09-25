window.TeamFinder.Title = (function (Title) {
	Title.UI = (function (UI) {
		UI.insertTitleOnPage = function (data) {
			$('#h1HeadContainer').html(data);
		};	
		
		return UI;
	}(Title.UI || {}));
	
	Title.initialize = function () {
		TeamFinder.callServer('../data/title.html', '', 'GET', 'html', Title.UI.insertTitleOnPage, TeamFinder.handleError);
	};
	
	return Title;
}(window.TeamFinder.Title || {}));

TeamFinder.ready(TeamFinder.Title.initialize);