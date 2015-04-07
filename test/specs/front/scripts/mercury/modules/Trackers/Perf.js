QUnit.module('Mercury.Modules.Trackers.Perf tests');

QUnit.test('Class was correctly compiled into Mercury.Modules', function () {
	ok(Mercury.Modules.Trackers.Perf);
});

QUnit.test('depsLoaded should initialize as false', function () {
	equal(Mercury.Modules.Trackers.Perf.checkDependencies(), false);
});


