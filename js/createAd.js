window.Zapto.CreateAd = (function (CreateAd) {
	CreateAd.UI = (function (UI) {
		UI.createAdCallback = function (data) {
			CreateAd.Elements.divSuccess.show();
			CreateAd.Elements.divCreateAdFormContainer.hide();
			
			//Display results using data (data === Ad-object)
			
			CreateAd.Elements.divSuccess.delay(2000).fadeOut('fast', function() {
				CreateAd.Elements.divResult.show();
				CreateAd.Elements.divSuccess.hide();
			});
		};
		
		return UI;
	}(CreateAd.UI || {}));
	
	CreateAd.initialize = function () {
		//Set initial values
		CreateAd.Elements.initialize();
		CreateAd.Elements.divResult.hide();
		CreateAd.Elements.divSuccess.hide();
		
		//Create UI elements
		Zapto.UI.createDropDown(CreateAd.Elements.selectSport, '../data/getAdFilterData.php', {q: 'sports', defaultText: '--Sport--', selected: null});
		Zapto.UI.createDropDown(CreateAd.Elements.selectLocation, '../data/getAdFilterData.php', {q: 'locations', defaultText: '--Location--', selected: null});
		Zapto.UI.createDropDown(CreateAd.Elements.selectLookingFor, '../data/getAdFilterData.php', {q: 'lookingFor', defaultText: '--Looking For--', selected: null});
		
		//Hook up events
		CreateAd.Elements.formCreateAd.on('submit', function () {
			var data = CreateAd.Elements.formCreateAd.serialize();
			var json_data = CreateAd.Elements.formCreateAd.serializeArray();
			
			// ToDo: Validate fields (using jquery validate?)
			var user = JSON.parse(Zapto.Utils.getCookie('tfUser'));
			if (null == user || !Zapto.Utils.notNullOrEmpty(user.Id) || !Zapto.Utils.notNullOrEmpty(user.SessionId)) {
				alert('You need to be logged in to create an ad');
				return false;
			}
			
			Zapto.callServer('../data/createAd.php', {
				description: CreateAd.Elements.txtDescription,
				headline: CreateAd.Elements.txtHeadline,
				location: Zapto.Utils.getSelectedDropDownValue(CreateAd.Elements.selectLocation),
				lookingFor: Zapto.Utils.getSelectedDropDownValue(CreateAd.Elements.selectLookingFor),
				sport: Zapto.Utils.getSelectedDropDownValue(CreateAd.Elements.selectSport),
				userId: user.Id
			}, 'POST', 'json', CreateAd.UI.createAdCallback, Zapto.handleError);
		});
	};
	
	CreateAd.Elements = (function (Elements) {
		Elements.divCreateAdFormContainer = null;
		Elements.divResult = null;
		Elements.divSuccess = null;
		Elements.formCreateAd = null;
		Elements.selectLocation = null;
		Elements.selectLookingFor = null;
		Elements.selectSport = null;
		Elements.txtDescription = null;
		Elements.txtHeadline = null;
		
		Elements.initialize = function() {
			Elements.divCreateAdFormContainer = $('#divCreateAdFormContainer');
			Elements.divResult = $('#divResult');
			Elements.divSuccess = $('#divSuccess');
			Elements.formCreateAd = $('#formCreateAd');
			Elements.selectLocation = $('#selectLocation');
			Elements.selectLookingFor = $('#selectLookingFor');
			Elements.selectSport = $('#selectSport');
			Elements.txtDescription = $('#txtDescription');
			Elements.txtHeadline = $('#txtHeadline');
		};
		
		return Elements;
	}(CreateAd.Elements || {}));
	
	return CreateAd;
}(window.Zapto.CreateAd || {}));

Zapto.selectedMenuItem = 'menuCreate';
Zapto.ready(Zapto.CreateAd.initialize);