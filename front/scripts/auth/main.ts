window.document.addEventListener('DOMContentLoaded', function ():void {
	new Form(window.document.querySelector('form')).watch();

	Array.prototype.forEach.call(document.querySelectorAll('.auto-tab'), function (input: Element) {
		new AutoTab(input).init();
	});

	//TODO Figure out a nicer way of diving javascripts / recognizing a page type
	if (document.querySelector('#loginForm')) {
		new LoginValidator().watch();
	}
});
