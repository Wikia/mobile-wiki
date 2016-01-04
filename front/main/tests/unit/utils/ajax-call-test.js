import sinon from 'sinon';

QUnit.module('Unit | Utils | ajax-call', (hooks) => {
	let spy;

	hooks.beforeEach(() => {
		spy = sinon.spy($, 'ajax');
	});

	hooks.afterEach(() => {
		// Restore default ajax behavior
		$.ajax.restore();
	});


	QUnit.test('Checking ajaxCall utils request params.', (assert) => {
		const test = require('main/utils/ajax-call').default,
			testCases = [
				{
					title: 'Default options',
					options: {
					},
					expected: {
						contentType: 'aplication/json',
						dataType: 'json',
						method: 'GET',
						xhrFields: {
							withCredentials: true
						},
						success() {},
						error() {}
					}
				}, {
					title: 'Passing options to ajax call',
					options: {
						contentType: 'aplication/json',
						dataType: 'json',
						method: 'PUT',
						success() {},
						error() {}
					},
					expected: {
						contentType: 'aplication/json',
						dataType: 'json',
						method: 'PUT',
						xhrFields: {
							withCredentials: true
						},
						success() {},
						error() {}
					}
				}, {
					title: 'Extending defaults',
					options: {
						dataType: 'xml',
						xhrFields: {
							withCredentials: false
						},
					},
					expected: {
						contentType: 'aplication/json',
						dataType: 'xml',
						method: 'GET',
						xhrFields: {
							withCredentials: false
						},
						success() {},
						error() {}
					}
				}
			];

		let testOut;

		testCases.forEach((testCase) => {
			test(testCase.options);
			testOut = $.ajax.getCall(0);

			assert.propEqual(testCase.expected, testOut.args[0]);
			spy.reset();
		});
	});
});
