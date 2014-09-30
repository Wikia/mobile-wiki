QUnit.module('lib/Logger');

test('Logger interface', function () {

	var functions = [
		'fatal',
		'error',
		'warn',
		'info',
		'debug',
		'trace'
	];
	functions.forEach(function (functionName) {
		equal(global.hasOwnProperty(functionName), true, 'Has function ' + functionName);
	});
});

test('Logger logs message', function () {
	equal(typeof global.info('Sample test message'), 'undefined', 'Logs message');
});
