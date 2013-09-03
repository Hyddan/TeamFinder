window.Zapto.Title = (function (Title) {
	Title.UI = (function (UI) {
		UI.insertTitleOnPage = function (data) {
			$('#h1HeadContainer').html(data);
		};	
		
		return UI;
	}(Title.UI || {}));
	
	Title.initialize = function () {
		Zapto.callServer('../title.html', '', 'GET', 'html', Title.UI.insertTitleOnPage, Zapto.handleError);
	};
	
	return Title;
}(window.Zapto.Title || {}));

Zapto.ready(Zapto.Title.initialize);