window.TeamFinder.Title = (function (Title) {
	Title.Callbacks = (function (Callbacks) {
		Callbacks.title = function (data) {
			$('#h1HeadContainer').html(data);
		};	
		
		return Callbacks;
	}(Title.Callbacks || {}));
	
	Title.initialize = function () {
		TeamFinder.callServer('../data/title.html', '', 'GET', 'html', Title.Callbacks.title, TeamFinder.handleError);
	};
	
	return Title;
}(window.TeamFinder.Title || {}));

TeamFinder.ready(TeamFinder.Title.initialize);