QUnit.module('auth/signup/SignupForm)', {
	setup: function () {
		var form = document.createElement('form');
		form.action = '/example/asd';
		form.appendChild(document.createElement('button'));

		this.generalErrorSpy = sinon.spy();
		this.validationErrorsSpy = sinon.spy();
		this.successfulRegistration = sinon.spy();
		this.marketingStub = sinon.stub(window, 'MarketingOptIn').returns({
			init: Function.prototype
		});
		this.formErrorsStub = sinon.stub(window, 'FormErrors').returns({
			trackValidationErrors: Function.prototype,
			displayGeneralError: this.generalErrorSpy,
			displayValidationErrors: this.validationErrorsSpy,
			clearValidationErrors: Function.prototype,
			translateValidationError: Function.prototype
		});

		this.signupForm = new SignupForm(form);
		this.signupForm.onSuccessfulRegistration = this.successfulRegistration;

		this.signupForm.getFormValues = function () {
			return {};
		};

		this.server = sinon.fakeServer.create();
	},
	teardown: function () {
		this.server.restore();
		this.marketingStub.restore();
		this.formErrorsStub.restore();
		delete this.server;
	}
});

QUnit.test('SignupForm is loaded', function () {
	ok(typeof window.SignupForm === 'function');
});

QUnit.test('SignupForm successful path', function () {
	this.server.respondWith(
		'/example/asd',
		[200, {'Content-Type': 'application/json'}, '{"user_id": "123"}']
	);

	this.signupForm.onSubmit(document.createEvent('Event'));
	this.server.respond();

	ok(this.generalErrorSpy.called === false);
	ok(this.validationErrorsSpy.called === false);
	ok(this.successfulRegistration);
});

QUnit.test('SignupForm general request error', function () {
	this.server.respondWith(
		'/example/asd',
		[500, {'Content-Type': 'application/json'}, '']
	);

	this.signupForm.onSubmit(document.createEvent('Event'));
	this.server.respond();

	ok(this.generalErrorSpy.calledOnce);
});

QUnit.test('SignupForm field error', function () {
	this.server.respondWith(
		'/example/asd',
		[400, {'Content-Type': 'application/json'}, '{"errors": [{"description": "email_already_exists", "additional": {"field": "email"}}]}']
	);

	this.signupForm.onSubmit(document.createEvent('Event'));
	this.server.respond();
	ok(this.validationErrorsSpy.called);
});

QUnit.test('SignupForm field and general error', function () {
	this.server.respondWith(
		'/example/asd',
		[400, {'Content-Type': 'application/json'}, '{"errors": [{"description": "email_already_exists", "additional": {"field": "email"}}, {"description": "username_blocked", "additional": {"field": "username"}}]}']
	);

	this.signupForm.onSubmit(document.createEvent('Event'));
	this.server.respond();

	ok(this.validationErrorsSpy.called);
});
