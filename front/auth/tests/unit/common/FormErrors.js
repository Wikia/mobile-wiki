QUnit.module('auth/common/FormErrors)', function (hooks) {
	hooks.beforeEach(function () {
		var form = document.createElement('form'),
		AuthTracker = function() {
			return {
				setGaCategory: Function.prototype,
				trackClick: Function.prototype,
				trackPageView: Function.prototype,
				trackSubmit: Function.prototype,
				track: Function.prototype
			}
		};
		FormModule = {};

		mrequire.entries['auth/common/FormErrors'].callback(FormModule, AuthTracker, null);

		this.formErrors = new FormModule.default(form);

		this.formErrors.trackValidationErrors = Function.prototype;
		this.formErrors.displayFieldValidationError = sinon.spy();
		this.formErrors.displayGeneralError = sinon.spy();

		window._pageParams = window.pageParams;
		window.pageParams = {
			viewType: 'mobile'
		};
	});
	hooks.afterEach(function (assert) {
		window.pageParams = window._pageParams;
	});

	QUnit.test('FormErrors class is loaded', function (assert) {
		ok(typeof mrequire('auth/common/FormErrors').default === 'function');
	});

	QUnit.test('Displaying field error', function (assert) {
		this.formErrors.displayValidationErrors([{
			'description': 'email_already_exists',
			'additional': {'field': 'email'}
		}]);

		assert.ok(this.formErrors.displayGeneralError.called === false);
		assert.ok(this.formErrors.displayFieldValidationError.called);
	});

	QUnit.test('SignupForm field and general error', function (assert) {
		this.formErrors.displayValidationErrors([{
			'description': 'email_already_exists',
			'additional': {'field': 'email'}
		},
			{'description': 'username_blocked', 'additional': {'field': 'username'}}]);

		assert.ok(this.formErrors.displayGeneralError.called);
		assert.ok(this.formErrors.displayFieldValidationError.called);
	});

});
