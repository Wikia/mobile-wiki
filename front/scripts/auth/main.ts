window.document.addEventListener('DOMContentLoaded', function ():void {
	var formElement = window.document.querySelector('form');
	new Form(formElement).watch();
	new SubmitValidator(document.querySelector('form')).watch();
	new BirthdateInput(window.document.querySelector('.birthdate-container'), 'US').init();
});
