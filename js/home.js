function getSlideshowDataCallback(data) {
	var id = data[0]['id'];
	for (var i=0; i<3; i++){
		var headline = data[i]['headline'];
		var location = data[i]['location'];
		var sport = data[i]['sport'];
		
		$('#slider_table').append("<tr><td>" + headline + "</td><td>" + sport + "</td><td>" + location + "</td></tr>");
	}
};

function initSlideshow() {
	$("#slideshow > div:gt(0)").hide();
	
	setInterval(function() { 
		$('#slideshow > div:first')
		.fadeOut(1000)
		.next()
		.fadeIn(1000)
		.end()
		.appendTo('#slideshow');
	},  3000);
	
	Zapto.callServer('bin/getAdData.php', { pageIndex: 0, pageSize: 3, q: 'data' }, 'GET', 'json', getSlideshowDataCallback, Zapto.handleError);
}

function quickSearch(){
	var queryStringParams = $("#quick_search_form").serialize();
	$(window.location).attr('href', '../listAds.html?' + queryStringParams);
}

function initiateStart(){
	initSlideshow();
	
	var citiesSelect =  $("#qs_location");
	var sportSelect =  $("#qs_sport");
	var lookingSelect =  $("#qs_looking");
	
	Zapto.UI.createDropDown(sportSelect, 'bin/getAdFilterData.php', {q: 'sports', defaultText: '--Sport--', selected: null});
	Zapto.UI.createDropDown(citiesSelect, 'bin/getAdFilterData.php', {q: 'cities', defaultText: '--Location--', selected: null});
	Zapto.UI.createDropDown(lookingSelect, 'bin/getAdFilterData.php', {q: 'lookingFor', defaultText: '--Looking For--', selected: null});
}

Zapto.selectedMenuItem = 'menuHome';
Zapto.ready(initiateStart);