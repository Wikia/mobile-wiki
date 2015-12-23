var testrunner = require('qunit'),
	glob = require('glob'),
	path = require('path');

testrunner.setup({
	deps: {
		path: './www/config/localSettings.js',
		namespace: 'localSettings'
	},
	log: {
		// log assertions overview
		assertions: false,
		// log expected and actual values for failed tests
		errors: true,
		// log tests overview
		tests: false,
		// log summary
		summary: true,
		// log global summary (all files)
		globalSummary: false,
		// log currently testing code file
		testing: false
	},
	coverage: {
		dir: 'test/coverage/server',
		reporters: ['cobertura']
	},
	maxBlockDuration: 5000
});

var tests = glob.sync(__dirname + '/specs/server/**/*.js'),
	source = glob.sync(path.resolve('.') + '/www/server/**/*.js'),
	prepped = source.map(function (path) {
		var part = 'www/server',
			file = path.substring(path.indexOf(part) + (part.length + 1));

		return {
			code: path,
			tests: tests.filter(function (test) {
				return test.match(file);
			})
		};
	});

testrunner.run(prepped.filter(function (module) {
	return module.code.length && module.tests.length;
}), function (err, report) {
	if (err) {
		throw err;
	}

	if (report && report.failed > 0) {
		process.exit(1);
	}
});

