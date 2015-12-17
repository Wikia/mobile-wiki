QUnit.module('mercury/utils/ajaxCall', function () {
	QUnit.test('Checking ajaxCall utils request params.', function (assert) {
		var test = require('mercury/utils/ajaxCall').default,
			testOut,
			i = 0,
			testCases = [
				{
					title: 'Default options',
					options: {
						success: function(data) {
							resolve(this);
						},
						error: function (err) {
							resolve(this);
						}
					},
					expected: {
						contentType: 'aplication/json',
						dataType: 'json',
						method: 'GET',
						xhrFields: {
							withCredentials: true
						},
						success: function (data) {
							resolve(this);
						},
						error: function (err) {
							resolve(this);
						}
					}
				}, {
					title: 'Passing options to ajax call',
					options: {
						contentType: 'aplication/json',
						dataType: 'json',
						method: 'PUT',
						success: function(data) {
							resolve(this);
						},
						error: function (err) {
							resolve(this);
						}
					},
					expected: {
						contentType: 'aplication/json',
						dataType: 'json',
						method: 'PUT',
						xhrFields: {
							withCredentials: true
						},
						success: function(data) {
							resolve(this);
						},
						error: function (err) {
							resolve(this);
						}
					}
				}, {
					title: 'Extending defaults',
					options: {
						dataType: 'xml',
						xhrFields: {
							withCredentials: false
						},
						success: function(data) {
							resolve(this);
						},
						error: function (err) {
							resolve(this);
						}
					},
					expected: {
						contentType: 'aplication/json',
						dataType: 'xml',
						method: 'GET',
						xhrFields: {
							withCredentials: false
						},
						success: function(data) {
							resolve(this);
						},
						error: function (err) {
							resolve(this);
						}
					}
				}
			];

		sinon.spy($, "ajax");

		testCases.forEach(function(testCase) {
			test(testCase.options);
			testOut = $.ajax.getCall(i);
			assert.propEqual(testCase.expected, testOut.args[0]);
			i++;
		});
		// Restore default ajax behavior
		$.ajax.restore();
	});
});
