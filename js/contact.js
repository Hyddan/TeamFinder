window.Zapto.Contact = (function(Contact) {
	Contact.UI = (function(UI) {
		
		return UI;
	}(Contact.UI || {}));
	
	Contact.initialize = function() {
	};
	
	return Contact;
}(window.Zapto.Contact || {}));

Zapto.selectedMenuItem = 'menuContact';
Zapto.ready(Zapto.Contact.initialize);