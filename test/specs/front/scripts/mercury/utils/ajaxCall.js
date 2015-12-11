QUnit.module('mercury/utils/ajaxCall', function () {
	QUnit.test('Mocking ajax request via ajaxCall.', function (assert) {
		var ajaxCallParams = {},
			test = require('mercury/utils/ajaxCall').default,
			testCases = [
				{
					title: 'Default options',
					options: {
						error: function(err) {
							ajaxCallParams = err;
							resolve(this);
						},
						beforeSend: function(jqXHR, settings) {
							$(ajaxCallParams).append(settings);
						}
					},
					expected: {
						dataType: 'json',
						method: 'GET',
						xhrFields: {
							withCredentials: true
						}
					}
				}, {
					title: 'Passing options to ajax call',
					options: {
						contentType: 'aplication/json',
						method: 'PUT',
						error: function (err) {
							this.ajaxCallParams = this;
							resolve(this);
						}
					},
					expected: {
						contentType: 'aplication/json',
						method: 'PUT'
					}
				}, {
					title: 'Extending defaults',
					options: {
						dataType: 'xml',
						xhrFields: {
							withCredentials: false
						},
						error: function (err) {
							ajaxCallParams = this;
							resolve(this);
						}
					},
					expected: {
						dataType: 'xml',
						method: 'GET',
						xhrFields: {
							withCredentials: false
						}
					}
				}
			];

		testCases.forEach(function(testCase) {
			var testOut = test(testCase.options);
			console.log('ACTUAL', testOut);
			console.log('EXPECTED',testCase.expected);
			console.log('AJAXCALLPARAMS',ajaxCallParams);
			assert.propEqual(testOut, testCase.expected);
		});
	});
});
