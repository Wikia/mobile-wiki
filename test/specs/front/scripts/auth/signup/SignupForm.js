QUnit.module('auth/signup/SignupForm)', {
	setup: function () {
		var form = document.createElement('form');
		form.action = '/example/asd';
		form.appendChild(document.createElement('button'));

		this.generalErrorSpy = sinon.spy(),
		this.fieldErrorSpy = sinon.spy();

		this.signupForm = new SignupForm(form);
		this.signupForm.displayGeneralError = this.generalErrorSpy;
		this.signupForm.displayFieldValidationError = this.fieldErrorSpy;
		this.signupForm.getFormValues = function () {
			return {};
		};

		this.server = sinon.fakeServer.create();
	},
	teardown: function () {
		this.server.restore();
		delete this.server;
	}
});

QUnit.test('SignupForm is loaded', function () {
	ok(typeof window.SignupForm === 'function');
});

QUnit.test('SignupForm successful path', function () {
	this.server.respondWith(
		'/example/asd',
		[200, {'Content-Type': 'application/json'}, '']
	);

	this.signupForm.onSubmit(document.createEvent('Event'));
	this.server.respond();

	ok(this.generalErrorSpy.called === false);
	ok(this.fieldErrorSpy.called === false);
});

QUnit.test('SignupForm general request error', function () {
	this.server.respondWith(
		'/example/asd',
		[500, {'Content-Type': 'application/json'}, '']
	);

	this.signupForm.onSubmit(document.createEvent('Event'));
	this.server.respond();

	ok(this.generalErrorSpy.calledOnce);
	ok(this.fieldErrorSpy.called === false);
});

QUnit.test('SignupForm field error', function () {
	this.server.respondWith(
		'/example/asd',
		[400, {'Content-Type': 'application/json'}, '{"errors": [{"description": "email_already_exists", "additional": {"field": "email"}}]}']
	);

	this.signupForm.onSubmit(document.createEvent('Event'));
	this.server.respond();

	ok(this.generalErrorSpy.called === false);
	ok(this.fieldErrorSpy.called);
});


QUnit.test('SignupForm field and general error', function () {
	this.server.respondWith(
		'/example/asd',
		[400, {'Content-Type': 'application/json'}, '{"errors": [{"description": "email_already_exists", "additional": {"field": "email"}}, {"description": "username_unavailable", "additional": {"field": "username"}}]}']
	);

	this.signupForm.onSubmit(document.createEvent('Event'));
	this.server.respond();

	ok(this.generalErrorSpy.called);
	ok(this.fieldErrorSpy.called);
});
