var testrunner = require('qunit');

testrunner.setup({
	log: {
		// log assertions overview
		assertions: true,
		// log expected and actual values for failed tests
		errors: true,
		// log tests overview
		tests: true,
		// log summary
		summary: true,
		// log global summary (all files)
		globalSummary: false,
		// log currently testing code file
		testing: true
	}
});

testrunner.run({
    code: {
		path: __dirname + '/../dist/vignette.cjs.js',
		namespace: 'Vignette'
	},
    tests: __dirname + '/vignette.js'
}, function (err, report) {
	if (err) {
		console.error(err)
		process.exit(1);
	} else {
		console.log('Done');
	}
});
