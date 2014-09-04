QUnit.module('lib/Logger');

test('Logger interface', function() {
	var functions = [
		'emergency',
		'alert',
		'critical',
		'error',
		'warning',
		'notice',
		'info',
		'debug'
	];
	functions.forEach(function(functionName) {
		equal(global.hasOwnProperty(functionName), true, 'Has function ' + functionName);
	});
});