function hideDivAndShowAdData() {
	$("#success_ad").show();
	$('#form_div').hide();
	//var fieldNames = new Array("Headline", "Looking for", "Ad text", "Name", "Email", "Password", "Location", "Sport", "Age", "Gender");
	var data = $('#createAd').serializeArray();
	
	$('#success_ad').delay(2000).fadeOut("fast", function() { $("#result_div").show(); $("#success_ad").hide();});
	
	
	$("#result_headline").append(data[0].value);
	if(data[1].value == 'team'){
		$("#result_looking_for").append(data[9].value + " and your are looking for a " + data[1].value);
	} else{
		$("#result_looking_for").append(data[9].value + " and your are looking for more " + data[1].value);
	}
	$("#result_ad_text").append(data[2].value);
	$("#result_name").append(data[3].value);
	$("#result_email").append(data[4].value);
	$("#result_password").append(data[5].value);
	$("#result_location").append(data[6].value);
	$("#result_sport").append(data[7].value);
	$("#result_age").append(data[8].value);
};

function initializeCreateAd() {
	$("#result_div").hide();
	$("#success_ad").hide();
	
	//Hook up click events
	$('#createAd').submit(function() {
		var data = $('#createAd').serialize();
		var json_data = $('#createAd').serializeArray();
		
		// Validation of fields
		var email = $("#email").val();
		if(!(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(email))){
			alert('Invalid Email!');
		}

		Zapto.callServer('bin/createAd.php', data, 'post', 'html', hideDivAndShowAdData, Zapto.handleError);
	});
}

Zapto.selectedMenuItem = 'menuCreate';
Zapto.ready(initializeCreateAd);