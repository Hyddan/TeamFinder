window.Zapto = (function(Zapto) {
	Zapto.UI = (function(UI) {
		UI.adFilterData = {
			cities: null,
			lookingFor: null,
			sports: null
		};
		UI.adFilterMapping = {
			cities: {
				'Linköping': 'l',
				'Stockholm': 'st',
				'Sundsvall': 'su',
				'Uppsala': 'u'
			},
			lookingFor: {
				'Player': 'p',
				'Team': 't'
			},
			sports: {
				'Basketball': 'b',
				'Floorball': 'f',
				'Hockey': 'h',
				'Soccer': 's',
			}
		};
		
		UI.adFilterDataCallback = function(data) {
			$.each(data, function(index) {
				UI.adFilterData[this.type] = UI.adFilterData[this.type] || [];
				UI.adFilterData[this.type].push(this.value);
			});
		};
		
		UI.center = function(element) {
			element.css("left", ( $(window).width() - element.width() ) / 2+$(window).scrollLeft() + "px");
		};
		
		UI.createDropDown = function(jqSelectElement, url, params) {
			if(jqSelectElement.children().length > 1) {
				return;
			}
			if(UI.adFilterData[params.q]) {
				jqSelectElement.append($('<option></option').val('-').html(params.defaultText));
				$.each(UI.adFilterData[params.q], function(index) {
					var option = $('<option></option').val(UI.adFilterMapping[params.q][this]).html(this);
					if(UI.adFilterMapping[params.q][this] == params.selected) {
						option.attr('selected', 'selected');
					}
					jqSelectElement.append(option);
				});
				jqSelectElement.selectBoxIt({ theme: 'jqueryui' });
			}
			else {
				Zapto.callServer(url, {q: params.q}, 'GET', 'json', UI.adFilterDataCallback, Zapto.handleError);
				setTimeout(function() { UI.createDropDown(jqSelectElement, url, params); }, 500);
			}
				
			return jqSelectElement;
		};
		
		return UI;
	}(Zapto.UI || {}));
	
	Zapto.Utils = (function(Utils) {
		Utils.getSelectedDropDownValue = function(jqSelectElement) {
			var selectedValue = jqSelectElement.find('option:selected').val();
			if(selectedValue == '-') {
				return null;
			}
			
			return selectedValue;
		};
		
		Utils.getQueryStringParameter = function (parameter) {
			parameter = parameter.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
			var regexS = "[\\?&]" + parameter + "=([^&#]*)";
			var regex = new RegExp(regexS);
			var results = regex.exec(window.location.search);
			
			if(results != null) {
				results =  decodeURIComponent(results[1].replace(/\+/g, " "));
			}
			
			return results;
		};
		
        Utils.notNullOrEmpty = function (str) {
            if(str != null && str !== 'undefined' && str !== '') {
				return true;
			}
			return false;
        };
		
        Utils.notNullOrUndefinedFunction = function (func) {
            if(func != null && func !== 'undefined' && typeof func == 'function') {
				return true;
			}
			return false;
        };
		
		Utils.sanitizeFilter = function(filterType, filterValue) {
			for(var key in Zapto.UI.adFilterMapping[filterType]) {
				if(Zapto.UI.adFilterMapping[filterType][key] ===  filterValue) {
					return filterValue;
				}
			}
			
			return null;
		};

        return Utils;
    }(Zapto.Utils || {}));
	
	Zapto.callServer = function(url, data, requestMethod, dataType, success, error) {
		var utils = Zapto.Utils;
		$.ajax({
			url: url,
			type: requestMethod,
			data: data,
			dataType: dataType,
			success: function(data) {
				if(utils.notNullOrUndefinedFunction(success)) {
					success(data);
				}
				else {
					return data;
				}
			},
			error: function(error) {
				if(utils.notNullOrUndefinedFunction(error)) {
					error(error);
				}
			}
		});
	};
	
	Zapto.handleError = function(error) {
		console.log(error);
	};
	
	Zapto.loadDependencies = function() {
		Zapto.loadStyle('//code.jquery.com/ui/1.10.0/themes/base/jquery-ui.css', null);
		Zapto.loadStyle('//cdnjs.cloudflare.com/ajax/libs/jquery.selectboxit/2.9.0/jquery.selectBoxIt.css', null);
		Zapto.loadStyle('css/styles.css', null);
		
		Zapto.loadScript('//code.jquery.com/ui/1.10.0/jquery-ui.min.js', function() {
			Zapto.loadScript('//cdnjs.cloudflare.com/ajax/libs/jquery.selectboxit/2.9.0/jquery.selectBoxIt.min.js', null);
		});
		
		Zapto.loadScript('js/title.js', null);
		Zapto.loadScript('js/menu.js', null);
	};
	
	Zapto.loadScript = function (url, onLoad) {
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = url;

		if (script.readyState) {
			script.onreadystatechange = function () {
				if (script.readyState == 'loaded' || script.readyState == 'complete') {
					script.onreadystatechange = null;

					if (onLoad != null) {
						onLoad();
					}
				}
			};
		}
		else {
			if (onLoad != null) {
				script.onload = onLoad;
			}
		}

		document.getElementsByTagName('head')[0].appendChild(script);
	};
	
	Zapto.loadStyle = function (url, onLoad) {
		var link = document.createElement('link');
		link.rel = 'stylesheet';
		link.type = 'text/css';
		link.href = url;

		if (link.readyState) {
			link.onreadystatechange = function () {
				if (link.readyState == 'loaded' || link.readyState == 'complete') {
					link.onreadystatechange = null;

					if (onLoad != null) {
						onLoad();
					}
				}
			};
		}
		else {
			if (onLoad != null) {
				link.onload = onLoad;
			}
		}

		document.getElementsByTagName('head')[0].appendChild(link);
	};
	
	Zapto.initialize = function() {
		Zapto.loadDependencies();
	};
	
	Zapto.ready = $(document).ready;
	
	Zapto.initialize();
	
	return Zapto;
}(window.Zapto || {}));