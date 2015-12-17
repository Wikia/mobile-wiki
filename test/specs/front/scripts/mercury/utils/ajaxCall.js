QUnit.module('mercury/utils/ajaxCall', function () {
	QUnit.test('Checking ajaxCall utils request params.', function (assert) {
		var spy = sinon.spy($, "ajax"),
			test = mrequire('mercury/utils/ajaxCall').default,
			testOut,
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

		testCases.forEach(function(testCase) {
			test(testCase.options);
			testOut = $.ajax.getCall(0);
			assert.propEqual(testCase.expected, testOut.args[0]);
			spy.reset();
		});
		// Restore default ajax behavior
		$.ajax.restore();
	});
});
