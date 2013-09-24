window.Zapto.Contact = (function(Contact) {
	Contact.Elements = (function (Elements) {
		Elements.divFAQContainer = null;
		
		Elements.initialize = function () {
			for (var key in this) {
				if ('function' !== typeof this[key]) {
					this[key] = $('#' + key);
				}
			}
		};
		
		return Elements;
	}(Contact.Elements || {}));
	
	Contact.UI = (function(UI) {
		UI.initAccordion = function (data) {
			var _isUiAccordion = false;
			
			try {
				_isUiAccordion = Contact.Elements.divFAQContainer.is(':ui-accordion');
			}
			catch (ex) {
				_isUiAccordion = false;
			}
			
			if (_isUiAccordion) {
				Contact.Elements.divFAQContainer.accordion('destroy');
			}
			
			Zapto.Utils.delay.call(this, function () {
				Contact.Elements.divFAQContainer.accordion({
					active: false,
					autoHeight: false,
					collapsible: true,
					event: 'click',
					header: 'h3',
					heightStyle: 'content'
				});
			}, 'obj => !Zapto.Utils.notNullOrUndefinedFunction(obj.accordion)', Contact.Elements.divFAQContainer, 1);
		};
		
		return UI;
	}(Contact.UI || {}));
	
	Contact.initialize = function() {
		Contact.Elements.initialize();
		
		Contact.UI.initAccordion();
	};
	
	Contact.loadDependencies = function () {
		Zapto.loadStyle('../css/Contact.css', null);
	};
	
	Contact.loadDependencies();
	
	return Contact;
}(window.Zapto.Contact || {}));

Zapto.selectedMenuItem = 'menuContact';
Zapto.ready(Zapto.Contact.initialize);