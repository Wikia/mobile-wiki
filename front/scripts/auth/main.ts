window.document.addEventListener('DOMContentLoaded', function ():void {
	new Form(window.document.querySelector('form')).watch();
	new BirthdateInput(window.document.querySelector('.birthdate-container'), 'UK').init();

	//TODO Figure out a nicer way of diving javascripts / recognizing a page type
	if (document.querySelector('#loginForm')) {
		new LoginValidator().watch();
	}
});
