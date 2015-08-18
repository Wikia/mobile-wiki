QUnit.module('auth/common/FormErrors)', {
	setup: function () {
		var form = document.createElement('form');

		this.formErrors = new FormErrors(form);
		this.formErrors.trackValidationErrors = Function.prototype;
		this.formErrors.displayFieldValidationError = sinon.spy();
		this.formErrors.displayGeneralError = sinon.spy();
		this.AuthTrackerStub = sinon.stub(window, 'AuthTracker').returns({
			setGaCategory: Function.prototype,
			trackClick: Function.prototype,
			trackPageView: Function.prototype,
			trackSubmit: Function.prototype,
			track: Function.prototype
		});
	},
	teardown: function () {
		this.AuthTrackerStub.restore();
	}
});

QUnit.test('FormErrors class is loaded', function () {
	ok(typeof window.FormErrors === 'function');
});

QUnit.test('Displaying field error', function () {
	this.formErrors.displayValidationErrors([{'description': 'email_already_exists', 'additional': {'field': 'email'}}]);

	ok(this.formErrors.displayGeneralError.called === false);
	ok(this.formErrors.displayFieldValidationError.called);
});

QUnit.test('SignupForm field and general error', function () {
	this.formErrors.displayValidationErrors([{'description': 'email_already_exists', 'additional': {'field': 'email'}},
		{'description': 'username_blocked', 'additional': {'field': 'username'}}]);

	ok(this.formErrors.displayGeneralError.called);
	ok(this.formErrors.displayFieldValidationError.called);
});
