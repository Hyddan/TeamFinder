window.TeamFinder = (function (TeamFinder) {
	var _loggedInUser = null;
	
	TeamFinder.Callbacks = (function (Callbacks) {
		Callbacks.createUser = function (user) {
			if (TeamFinder.Utils.notNullOrEmpty(user) && TeamFinder.Utils.notNullOrEmpty(user.SessionId)) {
				TeamFinder.Utils.setCookie('tfUser', JSON.stringify(user));
				_loggedInUser = user;
				TeamFinder.Authentication.updateButtonLabel();
				TeamFinder.Authentication.Elements.formSignUp[0].reset();
				TeamFinder.Authentication.Elements.divSignUpPlaceHolder.slideUp();
				TeamFinder.Authentication.Elements.divSignUpValidationMessage.text('');
				TeamFinder.Authentication.Elements.divSignUpValidationMessage.hide();
				
				TeamFinder.Events.onSignUp(user);
				TeamFinder.Events.onLogIn(user);
			}
		};
		
		Callbacks.logIn = function (user) {
			if (TeamFinder.Utils.notNullOrEmpty(user) && TeamFinder.Utils.notNullOrEmpty(user.SessionId)) {
				TeamFinder.Utils.setCookie('tfUser', JSON.stringify(user));
				_loggedInUser = user;
				TeamFinder.Authentication.updateButtonLabel();
				TeamFinder.Authentication.Elements.formAuthenticate[0].reset();
				TeamFinder.Authentication.Elements.divAuthenticateValidationMessage.text('');
				TeamFinder.Authentication.Elements.divAuthenticateValidationMessage.hide();
				
				TeamFinder.Events.onLogIn(user);
			}
			else {
				TeamFinder.Authentication.Elements.divAuthenticationPlaceHolder.slideDown();
				TeamFinder.Authentication.Elements.divAuthenticateValidationMessage.text('Invalid credentials');
				TeamFinder.Authentication.Elements.divAuthenticateValidationMessage.show();
			}
		};
		
		Callbacks.logOut = function (user) {
			TeamFinder.Utils.deleteCookie('tfUser');
			_loggedInUser = null;
			TeamFinder.Authentication.updateButtonLabel();
				
			TeamFinder.Events.onLogOut(user);
		};
		
		return Callbacks;
	}(TeamFinder.Callbacks || {}));
		
	TeamFinder.Environment = (function (Environment) {
		Environment.Device = Environment.Device || {};
		Environment.detect = function () {
			Environment.Device.isIPhone = TeamFinder.Utils.notNullOrEmpty(navigator.userAgent.match(/(iPhone)/gi));
			Environment.Device.isMobile = TeamFinder.Utils.notNullOrEmpty(navigator.userAgent.match(/(android|iPad|iPhone|iPod)/gi));
		};
		
		return Environment;
	}(TeamFinder.Environment || {}));
	
	TeamFinder.Events = (function (Events) {
		Events.onLogIn = function (user) {
		};
		
		Events.onLogOut = function (user) {
		};
		
		Events.onSignUp = function (user) {
		};
		
		return Events;
	}(TeamFinder.Events || {}));
	
	TeamFinder.UI = (function (UI) {
		UI.adFilterData = {
			locations: null,
			lookingFor: null,
			sports: null
		};
		
		UI.adFilterMapping = {
			locations: {
				'Linköping': 'l',
				'Stockholm': 'st',
				'Sundsvall': 'su',
				'Uppsala': 'u'
			},
			lookingFor: {
				'Player': 'p',
				'Team': 't',
				'Opponent': 'o'
			},
			sports: {
				'Basketball': 'b',
				'Floorball': 'f',
				'Hockey': 'h',
				'Soccer': 's',
				'Squash': 'sq',
			}
		};
		
		UI.Callbacks = (function (Callbacks) {
			Callbacks.adFilterData = function (data) {
				UI.adFilterData[data.type] = [];
				$.each(data.items, function (index) {
					UI.adFilterData[data.type].push(this.Name);
				});
			};
			
			return Callbacks;
		}(UI.Callbacks || {}));
		
		UI.center = function (element) {
			element.css("left", ($(window).width() - element.width()) / 2 + $(window).scrollLeft() + "px");
		};
		
		UI.createDropDown = function (jqSelectElement, url, params) {
			if (jqSelectElement.children().length > 1) {
				return;
			}
			if (UI.adFilterData[params.q]) {
				jqSelectElement.append($('<option></option').val('-').html(params.defaultText));
				$.each(UI.adFilterData[params.q], function (index) {
					var option = $('<option></option').val(UI.adFilterMapping[params.q][this]).html(this);
					if (UI.adFilterMapping[params.q][this] == params.selected) {
						option.attr('selected', 'selected');
					}
					jqSelectElement.append(option);
				});
		
				TeamFinder.Utils.delay.call(this, function () {
					jqSelectElement.selectBoxIt({ theme: 'jqueryui' });
				}, 'obj => !TeamFinder.Utils.notNullOrUndefinedFunction(obj.selectBoxIt)', jqSelectElement, 1);
			}
			else {
				TeamFinder.callServer(url, {q: params.q}, 'GET', 'json', UI.Callbacks.adFilterData, TeamFinder.handleError);
				setTimeout(function () { UI.createDropDown(jqSelectElement, url, params); }, 500);
			}
				
			return jqSelectElement;
		};
		
		return UI;
	}(TeamFinder.UI || {}));
	
	TeamFinder.Utils = (function (Utils) {
		Utils.emailValidationRegex = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i;
		
		Utils.createFunctionFromLambda = (function () {
            var lambdaCache = {};

            return function (lambda) {
                if ('string' !== typeof lambda) {
                    throw new TypeError("Syntax error, lambda expression must be of type string.");
                }

                var result = lambdaCache[lambda];

                if (typeof result !== 'function') {
                    var funcParts = lambda.match(/(.*)\s*=>\s*(.*)/);
                    funcParts.splice(0, 1);

                    var funcBody = funcParts.pop(),
                        funcParameters = [];

                    if (Utils.exists(funcBody)) {
                        funcParameters = Utils.normalize(funcParts.pop()).replace(/,|\(|\)/g, '').split(' ');
                    }

                    funcBody = ((!/\s*return\s+/.test(funcBody)) ? "return " : "") + funcBody + ';';
                    funcParameters.push(funcBody);

                    try {
                        result = lambdaCache[lambda] = Function.apply({}, funcParameters);
                    }
                    catch (e) {
                        throw "Syntax error in lambda expression: " + lambda;
                    }
                }

                return result;
            };
        }());
		
		Utils.delay = function (func, shouldDelayLambda, delayObj, counter) {
            var _self = this;
            this.counter = counter || this.counter || 0;

            if (Utils.createFunctionFromLambda(shouldDelayLambda).call({}, delayObj)) {
                if (this.counter < 50) {
                    setTimeout(function () { ++_self.counter; Utils.delay.call(_self, func, shouldDelayLambda, delayObj) }, 200);
                }
            }
            else {
                return func.call(this);
            }
        };
		
		Utils.deleteCookie = function (name) {
			TeamFinder.Utils.setCookie(name, '', -1);
		};
		
		Utils.exists = function (obj) {
            return 'undefined' !== typeof obj;
        };
		
		Utils.getCookie = function (name) {
			var i, _cookie, _cookieArr = document.cookie.split(';');
			for (i = 0; i < _cookieArr.length; i++) {
				_cookie = _cookieArr[i].trimLeft();
				
				if (0 === _cookie.indexOf(name)) {
					return decodeURIComponent(_cookie.substring(1 + name.length, _cookie.length));
				}
			}
			
			return null;
		};
		
		Utils.getFilterValue = function(filterType, filterKey) {
			for(var key in TeamFinder.UI.adFilterMapping[filterType]) {
				if(key ===  filterKey) {
					return TeamFinder.UI.adFilterMapping[filterType][key];
				}
			}
			
			return null;
		};
		
		Utils.getSelectedDropDownValue = function (jqSelectElement) {
			var selectedValue = jqSelectElement.find('option:selected').val();
			if (selectedValue == '-') {
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

		Utils.isValidEmail = function (email) {
			return Utils.emailValidationRegex.test(email);
		};
				
		Utils.normalize = function (str) {
            if (Utils.exists(str)) {
                return str.replace(/^\s*|\s(?=\s)|\s*$/g, '');
            }

            return null;
        }
		
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
			for(var key in TeamFinder.UI.adFilterMapping[filterType]) {
				if(TeamFinder.UI.adFilterMapping[filterType][key] ===  filterValue) {
					return filterValue;
				}
			}
			
			return null;
		};
		
		Utils.setCookie = function (name, value, expiresInMS) {
			var _date, _expiresCookiePart = '';
			if (Utils.notNullOrEmpty(expiresInMS)) {
				_date = new Date();
				_date.setTime(_date.getTime() + expiresInMS);
				_expiresCookiePart = '; expires=' + _date.toUTCString();
			}
			
			document.cookie = Utils.stringFormat('{0}={1}{2}; path=/; domain={3};', name, encodeURIComponent(value),_expiresCookiePart, window.location.hostname);
		}
		
		Utils.stringFormat = function (pattern) {
			if (!Utils.notNullOrEmpty(pattern)) {
				return null;
			}
			
			var _args = Array.prototype.slice.call(arguments, 0);
			for (var i = 1; i < _args.length; i++) {
				pattern = pattern.replace('{' + (i - 1) + '}', _args[i]);
			}
			
			return pattern;
		};
		
        return Utils;
    }(TeamFinder.Utils || {}));
	
	TeamFinder.callServer = function (url, data, requestMethod, dataType, success, error) {
		var utils = TeamFinder.Utils;
		$.ajax({
			url: url,
			type: requestMethod,
			data: data,
			dataType: dataType,
			success: function (data) {
				if(utils.notNullOrUndefinedFunction(success)) {
					success(data);
				}
				else {
					return data;
				}
			},
			error: function (xhr, message, err) {
				if(utils.notNullOrUndefinedFunction(error)) {
					error(xhr);
					error(message);
					error(err);
				}
			}
		});
	};
	
	TeamFinder.createUser = function (age, description, email, firstName, gender, lastName, password, pictureFileName) {
		TeamFinder.callServer('../data/createUser.php', {
				age: age,
				description: description,
				email: email,
				firstName: firstName,
				gender: gender,
				lastName: lastName,
				password: password,
				pictureFileName: pictureFileName
			}, 'POST', 'json', TeamFinder.Callbacks.createUser, TeamFinder.handleError
		);
	}
	
	TeamFinder.handleError = function (error) {
		console.log(error);
	};
	
	TeamFinder.isLoggedIn = function () {
		if (null == _loggedInUser) {
			var user = JSON.parse(TeamFinder.Utils.getCookie('tfUser'));
		
			if (null != user && TeamFinder.Utils.notNullOrEmpty(user.SessionId)) {
				_loggedInUser = user;
			}
		}
		
		return null != _loggedInUser;
	};
	
	TeamFinder.loadDependencies = function () {
		TeamFinder.loadStyle('../lib/jquery-ui.base-1.10.0.css', null);
		TeamFinder.loadStyle('../lib/jquery.selectBoxIt-2.9.0.css', null);
		TeamFinder.loadStyle('../css/teamFinder.css', null);
		TeamFinder.loadStyle('../css/oldStyles.css', null);
		TeamFinder.loadStyle('../css/menu.css', null);
		TeamFinder.loadStyle('../css/head.css', null);
		TeamFinder.loadStyle('../css/authentication.css', null);
		
		TeamFinder.loadScript('../lib/jquery-ui-1.10.3.min.js', function() {
			TeamFinder.loadScript('../lib/jquery.selectBoxIt-2.9.0.min.js', null);
		});
		
		TeamFinder.loadScript('../js/title.js', null);
		TeamFinder.loadScript('../js/menu.js', null);
		TeamFinder.loadScript('../js/authentication.js', null);
		TeamFinder.loadScript('../lib/webtoolkit.base64.js', null);
	};
	
	TeamFinder.loadScript = function (url, onLoad) {
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
	
	TeamFinder.loadStyle = function (url, onLoad) {
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
	
	TeamFinder.loggedInUser = (function () {
		if (null == _loggedInUser) {
			var user = JSON.parse(TeamFinder.Utils.getCookie('tfUser'));
		
			if (null != user && TeamFinder.Utils.notNullOrEmpty(user.SessionId)) {
				_loggedInUser = user;
			}
		}
		
		return {
			id: TeamFinder.isLoggedIn() ? _loggedInUser.Id : null,
			sessionId: TeamFinder.isLoggedIn() ? _loggedInUser.SessionId : null
		};
	})();
	
	TeamFinder.logIn = function (username, password) {
		TeamFinder.callServer('../data/authentication.php', {
				ajaxAction: 'logIn',
				username: username,
				password: password
			}, 'POST', 'json', TeamFinder.Callbacks.logIn, TeamFinder.handleError
		);
	};
	
	TeamFinder.logOut = function () {
		var user = JSON.parse(TeamFinder.Utils.getCookie('tfUser'));
		if (null != user && TeamFinder.Utils.notNullOrEmpty(user.SessionId)) {
			TeamFinder.callServer('../data/authentication.php', {
					ajaxAction: 'logOut',
					sessionId: user.SessionId
				}, 'POST', 'json', TeamFinder.Callbacks.logOut, TeamFinder.handleError
			);
		}
	};
	
	TeamFinder.initialize = function () {
		TeamFinder.loadDependencies();
	};
	
	TeamFinder.initialize();
	
	TeamFinder.ready = $(document).ready;
	
	return TeamFinder;
}(window.TeamFinder || {}));