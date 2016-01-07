QUnit.module('auth/signup/SignupForm', function (hooks) {
	hooks.beforeEach(function () {
		var form = document.createElement('form'),
			self = this;

		form.action = '/example/asd';
		form.appendChild(document.createElement('button'));

		self.generalErrorSpy = sinon.spy();
		self.validationErrorsSpy = sinon.spy();
		self.successfulRegistration = sinon.spy();

		var MarketingOptIn = function () {
				return {
					init: Function.prototype
				};
			},
			FormErrors = function () {
				return {
					trackValidationErrors: Function.prototype,
					displayGeneralError: self.generalErrorSpy,
					displayValidationErrors: self.validationErrorsSpy,
					clearValidationErrors: Function.prototype,
					translateValidationError: Function.prototype
				}
			},
			AuthTracker = function () {
				return {
					setGaCategory: Function.prototype,
					trackClick: Function.prototype,
					trackPageView: Function.prototype,
					trackSubmit: Function.prototype,
					track: Function.prototype
				}
			},
			AuthLogger = {
				getInstance: function () {
					return {
						xhrError: function () {}
					}
				}
			},
			HttpCodes = {
				OK: 200,
				BAD_REQUEST: 400
			},
			UrlHelper = function () {
				return {
					urlEncode: function (data) {
						return data;
					}
				}
			},
			TermsOfUse = function () {
				return {
					init: Function.prototype
				}
			};

		SignupForm = {};

		mrequire.entries['auth/signup/SignupForm'].callback(
			SignupForm,
			AuthTracker,
			AuthLogger,
			null,
			null,
			FormErrors,
			HttpCodes,
			UrlHelper,
			null,
			MarketingOptIn,
			TermsOfUse,
			null
		);

		this.signupForm = new SignupForm.default(form);
		this.signupForm.onSuccessfulRegistration = this.successfulRegistration;

		this.signupForm.getFormValues = function () {
			return {};
		};
		this.server = sinon.fakeServer.create();
	});

	hooks.afterEach(function () {
		delete this.server;
	});

	QUnit.test('SignupForm is loaded', function (assert) {
		assert.ok(typeof mrequire('auth/signup/SignupForm').default === 'function');
	});

	QUnit.test('SignupForm successful path', function (assert) {
		this.server.respondWith(
			'/example/asd',
			[200, {'Content-Type': 'application/json'}, '{"user_id": "123"}']
		);

		this.signupForm.onSubmit(document.createEvent('Event'));
		this.server.respond();

		assert.ok(this.generalErrorSpy.called === false);
		assert.ok(this.validationErrorsSpy.called === false);
		assert.ok(this.successfulRegistration);
	});

	QUnit.test('SignupForm general request error', function (assert) {
		this.server.respondWith(
			'/example/asd',
			[500, {'Content-Type': 'application/json'}, '']
		);

		this.signupForm.onSubmit(document.createEvent('Event'));
		this.server.respond();

		assert.ok(this.generalErrorSpy.calledOnce);
	});

	QUnit.test('SignupForm field error', function (assert) {
		this.server.respondWith(
			'/example/asd',
			[400, {'Content-Type': 'application/json'}, '{"errors": [{"description": "email_already_exists", "additional": {"field": "email"}}]}']
		);

		this.signupForm.onSubmit(document.createEvent('Event'));
		this.server.respond();
		assert.ok(this.validationErrorsSpy.called);
	});

	QUnit.test('SignupForm field and general error', function (assert) {
		this.server.respondWith(
			'/example/asd',
			[400, {'Content-Type': 'application/json'}, '{"errors": [{"description": "email_already_exists", "additional": {"field": "email"}}, {"description": "username_blocked", "additional": {"field": "username"}}]}']
		);

		this.signupForm.onSubmit(document.createEvent('Event'));
		this.server.respond();

		assert.ok(this.validationErrorsSpy.called);
	});
});
